import { buildMission } from './mission';
import { reviewOverdueDays, isReviewDue } from './review';
import { daysSince } from './time';
import type { Catalog, MissionKind, Recommendation, Topic, UserState } from './types';

export const RECOMMENDATION_CONFIG = {
  reviewBase: 30,
  reviewOverdueBonus: 10,
  reviewOverdueSaturationDays: 3,
  recentWindow: 15,
  recentMinAttempts: 5,
  recentErrorWeight: 50,
  /** Abaixo desta taxa de erro recente, errar é esporádico, não ponto fraco. */
  recentErrorMinRate: 0.25,
  lowMasteryWeight: 30,
  nextInPathWeight: 25,
  forgettingWeight: 15,
  forgettingSaturationDays: 10,
  lastMissionPenalty: 35,
  /** Missões seguidas no mesmo assunto antes de forçar alternância. */
  maxConsecutiveMissions: 2,
} as const;

type Factor = 'review' | 'errors' | 'low_mastery' | 'next_in_path' | 'forgetting';

interface Candidate {
  topic: Topic;
  score: number;
  factor: Factor;
  reason: string;
}

/** "O que estudar agora?" — ranking por fatores; o fator dominante vira o motivo exibido. */
export function recommendNextActivity(
  state: UserState,
  catalog: Catalog,
  now: number,
): Recommendation {
  const c = RECOMMENDATION_CONFIG;
  // Nada é bloqueado: todo assunto com conteúdo concorre; a ordem da trilha só orienta.
  const available = catalog.topics.filter((t) => t.available);
  if (available.length === 0) throw new Error('Nenhum assunto disponível.');
  const recent = state.recentMissionTopicIds;
  const lastTopic = recent.at(-1);
  // Alternância: depois de N missões seguidas no mesmo assunto, ele sai da disputa (se houver outro).
  const lastN = recent.slice(-c.maxConsecutiveMissions);
  const streakTopic =
    lastN.length === c.maxConsecutiveMissions && lastN.every((id) => id === lastTopic) ? lastTopic : undefined;
  const pool = available.length > 1 ? available.filter((t) => t.id !== streakTopic) : available;
  const nextInPath = available.find((t) => (state.progress[t.id]?.attempts ?? 0) === 0);

  const candidates = pool.map((topic): Candidate => {
    const p = state.progress[topic.id];
    const factors: { factor: Factor; score: number; reason: string }[] = [];

    if (p && isReviewDue(p.review, now)) {
      const overdue = reviewOverdueDays(p.review, now);
      const days = Math.round(daysSince(p.lastStudiedAt, now) ?? 0);
      factors.push({
        factor: 'review',
        score:
          c.reviewBase +
          c.reviewOverdueBonus * Math.min(1, overdue / c.reviewOverdueSaturationDays),
        reason:
          days >= 1
            ? `Hora de revisar ${topic.name} — faz ${plural(days, 'dia')}.`
            : `Hora de revisar ${topic.name}.`,
      });
    }

    const lastAttempts = state.attempts.filter((a) => a.topicId === topic.id).slice(-c.recentWindow);
    if (lastAttempts.length >= c.recentMinAttempts) {
      const wrong = lastAttempts.filter((a) => !a.correct).length;
      if (wrong / lastAttempts.length >= c.recentErrorMinRate) {
        factors.push({
          factor: 'errors',
          score: c.recentErrorWeight * (wrong / lastAttempts.length),
          reason: `Você errou ${wrong} das últimas ${lastAttempts.length} questões.`,
        });
      }
    }

    if (p && p.attempts > 0) {
      factors.push({
        factor: 'low_mastery',
        score: c.lowMasteryWeight * (1 - p.mastery.score / 100),
        reason: `${topic.name} está em ${p.mastery.score}%. Vamos subir isso.`,
      });
      const days = daysSince(p.lastStudiedAt, now) ?? 0;
      if (days >= 1) {
        factors.push({
          factor: 'forgetting',
          score: c.forgettingWeight * Math.min(1, days / c.forgettingSaturationDays),
          reason: `Você não pratica ${topic.name} há ${plural(Math.round(days), 'dia')}.`,
        });
      }
    }

    if (topic === nextInPath) {
      factors.push({ factor: 'next_in_path', score: c.nextInPathWeight, reason: 'Próximo passo da sua trilha.' });
    }

    const best = factors.reduce((a, b) => (b.score > a.score ? b : a), {
      factor: 'next_in_path' as Factor,
      score: 0,
      reason: 'Próximo passo da sua trilha.',
    });
    let score = factors.reduce((sum, f) => sum + f.score, 0);
    if (topic.id === lastTopic) score -= c.lastMissionPenalty;
    return { topic, score, factor: best.factor, reason: best.reason };
  });

  // Empate: ordem da trilha.
  const winner = candidates.reduce((a, b) => (b.score > a.score ? b : a));
  const kind = missionKindFor(winner.topic, winner.factor, state, catalog);
  const mission = buildMission(kind, winner.topic.id, state, catalog);
  return {
    topicId: winner.topic.id,
    missionKind: kind,
    reason: winner.reason,
    estimatedMinutes: mission.estimatedMinutes,
    mission,
  };
}

/** Missão para um assunto escolhido pela pessoa (trilha), com o tipo mais útil para ele. */
export function missionForTopic(topicId: string, state: UserState, catalog: Catalog, now: number) {
  const topic = catalog.topicById.get(topicId);
  if (!topic) throw new Error(`Assunto desconhecido: ${topicId}`);
  const p = state.progress[topicId];
  const factor: Factor =
    p && isReviewDue(p.review, now) ? 'review' : p && p.attempts > 0 ? 'low_mastery' : 'next_in_path';
  return buildMission(missionKindFor(topic, factor, state, catalog), topicId, state, catalog);
}

function missionKindFor(
  topic: Topic,
  factor: Factor,
  state: UserState,
  catalog: Catalog,
): MissionKind {
  if (factor === 'review') return 'review';
  const p = state.progress[topic.id];
  const lessons = catalog.lessonsByTopic.get(topic.id) ?? [];
  const hasUnseenLesson = lessons.some((l) => !p?.lessonsSeen.includes(l.id));
  // Enquanto o assunto é novo, primeiro vêm as lições.
  if (factor === 'errors') return 'weak_spot';
  if (hasUnseenLesson && (p?.mastery.level ?? 0) < 3) return 'learn';
  return 'practice';
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}
