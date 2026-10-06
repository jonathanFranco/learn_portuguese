import { advanceStep, answerRetry, answerStep, completeMission, currentResult, currentStep, isSessionFinished, startSession } from '../study';
import type { Answer, Catalog, Mission, Question, UserState } from '../types';
import { MINUTE } from '../time';

/** Resposta certa ou errada para qualquer tipo de questão (aluno simulado). */
export function answerFor(q: Question, right: boolean): Answer {
  switch (q.type) {
    case 'multiple_choice':
      return right ? q.correct : q.alternatives.find((a) => a.id !== q.correct)!.id;
    case 'true_false':
      return right ? q.correct : !q.correct;
    case 'fill_blank':
      return right ? q.correct : q.options.find((o) => o !== q.correct)!;
    case 'identify_error':
      return right ? q.correct : (q.correct + 1) % q.segments.length;
    case 'order':
      return right ? q.correct : [...q.correct].reverse();
    case 'match':
      return right ? q.pairs.map(([l, r]) => `${l}→${r}`) : [];
  }
}

/**
 * Joga uma missão inteira. `correctFor(questionId)` decide se acerta.
 * Cada passo leva 30 s. Retorna o estado final e o resumo.
 */
export function playMission(
  state: UserState,
  catalog: Catalog,
  mission: Mission,
  start: number,
  correctFor: (questionId: string, isRetry: boolean) => boolean,
) {
  const answer = (id: string, isRetry: boolean) =>
    answerFor(catalog.questionById.get(id)!, correctFor(id, isRetry));

  let now = start;
  let s = startSession(state, mission, now);
  while (!isSessionFinished(s.activeSession!)) {
    now += MINUTE / 2;
    const step = currentStep(s.activeSession!)!;
    if (step.kind === 'question' || step.kind === 'mistake_review') {
      s = answerStep(s, catalog, answer(step.questionId, false), now).state;
      const retry = currentResult(s.activeSession!)?.retry;
      if (retry) s = answerRetry(s, catalog, answer(retry.questionId, true), now).state;
    }
    s = advanceStep(s, now);
  }
  return completeMission(s, catalog, now);
}
