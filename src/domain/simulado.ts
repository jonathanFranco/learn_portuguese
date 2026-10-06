// Simulado: prova com tempo sobre todos os assuntos. Funções puras.

import { unlockAchievements } from './achievements';
import { emptyProgress } from './mastery';
import { createRng, shuffle } from './random';
import { afterMistake } from './review';
import { registerStudyDay } from './streak';
import { recordAttempt } from './study';
import { dayKey, MINUTE } from './time';
import type { Answer, Catalog, Question, SimuladoResult, UserState } from './types';

export const SIMULADO_CONFIG = {
  sizes: [10, 20, 30],
  /** Tempo de prova por questão. */
  minutesPerQuestion: 3,
  /** Simulados guardados no histórico. */
  history: 10,
} as const;

/**
 * Questões de todos os assuntos, uma por assunto por rodada (a prova cobre o máximo de assuntos),
 * preferindo as que a pessoa ainda não respondeu.
 */
export function pickSimuladoQuestions(state: UserState, catalog: Catalog, size: number, seed: string): string[] {
  const rng = createRng(seed);
  const seen = new Set(state.attempts.map((a) => a.questionId));
  const unseenFirst = (qs: Question[]) => shuffle(qs, rng).sort((a, b) => Number(seen.has(a.id)) - Number(seen.has(b.id)));
  const pools = shuffle(
    catalog.topics.filter((t) => t.available).map((t) => unseenFirst(catalog.questionsByTopic.get(t.id) ?? [])),
    rng,
  ).filter((qs) => qs.length > 0);

  const out: string[] = [];
  for (let round = 0; out.length < size && pools.some((qs) => qs.length > round); round++) {
    for (const qs of pools) {
      if (out.length >= size) break;
      const q = qs[round];
      if (q) out.push(q.id);
    }
  }
  return out;
}

export function startSimulado(state: UserState, catalog: Catalog, size: number, now: number): UserState {
  if (state.simulado) throw new Error('Já existe um simulado em andamento.');
  const id = `simulado:${now}`;
  const questionIds = pickSimuladoQuestions(state, catalog, size, id);
  if (questionIds.length === 0) throw new Error('Sem questões para montar o simulado.');
  return {
    ...state,
    simulado: {
      id,
      questionIds,
      answers: {},
      startedAt: now,
      limitMs: questionIds.length * SIMULADO_CONFIG.minutesPerQuestion * MINUTE,
    },
  };
}

/** Marca (ou troca) a resposta de uma questão. `undefined` deixa em branco. */
export function answerSimulado(state: UserState, questionId: string, answer: Answer | undefined): UserState {
  const sim = state.simulado;
  if (!sim || !sim.questionIds.includes(questionId)) return state;
  const { [questionId]: _, ...rest } = sim.answers;
  return { ...state, simulado: { ...sim, answers: answer === undefined ? rest : { ...rest, [questionId]: answer } } };
}

export function simuladoRemainingMs(state: UserState, now: number): number {
  const sim = state.simulado;
  return sim ? Math.max(0, sim.startedAt + sim.limitMs - now) : 0;
}

/**
 * Entrega: cada resposta vira tentativa (domínio, erros, XP), erros encurtam a revisão do assunto,
 * conta o dia de estudo. Em branco não conta nem como acerto nem como erro.
 */
export function finishSimulado(
  state: UserState,
  catalog: Catalog,
  now: number,
): { state: UserState; result: SimuladoResult } {
  const sim = state.simulado;
  if (!sim) throw new Error('Nenhum simulado em andamento.');
  const elapsedMs = Math.min(now - sim.startedAt, sim.limitMs);
  // Questão apagada (da pessoa) ou que saiu do conteúdo some da correção.
  const questions = sim.questionIds.flatMap((id) => catalog.questionById.get(id) ?? []);
  const answered = questions.filter((q) => sim.answers[q.id] !== undefined);
  const perQuestion = answered.length > 0 ? elapsedMs / answered.length : 0;

  let s = state;
  let correct = 0;
  const missed = new Set<string>();
  for (const q of answered) {
    const rec = recordAttempt(s, catalog, q, sim.answers[q.id]!, 'simulado', perQuestion, now);
    s = rec.state;
    if (rec.correct) correct++;
    else missed.add(q.topicId);
  }
  for (const topicId of missed) {
    const p = s.progress[topicId] ?? emptyProgress(topicId);
    s = { ...s, progress: { ...s.progress, [topicId]: { ...p, review: afterMistake(p.review, now) } } };
  }

  const result: SimuladoResult = {
    id: sim.id,
    finishedAt: now,
    elapsedMs,
    questionIds: questions.map((q) => q.id),
    answers: sim.answers,
    correct,
  };
  const today = dayKey(now);
  const day = s.dailyLog[today] ?? { minutes: 0, xp: 0, missions: 0 };
  s = {
    ...s,
    user: { ...s.user, lastStudiedAt: now },
    streak: answered.length > 0 ? registerStudyDay(s.streak, now) : s.streak,
    dailyLog: { ...s.dailyLog, [today]: { ...day, minutes: day.minutes + Math.max(1, Math.round(elapsedMs / MINUTE)) } },
    simulado: null,
    simulados: [...s.simulados, result].slice(-SIMULADO_CONFIG.history),
  };
  return { state: unlockAchievements(s, now).state, result };
}
