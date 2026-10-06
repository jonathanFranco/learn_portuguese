import type { Attempt, Mastery, MasteryLevel, Mistake, Progress, Topic } from './types';

export const MASTERY_CONFIG = {
  /** Meia-vida do peso por recência, em número de tentativas. */
  recencyHalfLife: 10,
  difficultyWeight: { 1: 1, 2: 1.3, 3: 1.7 },
  contextWeight: { mission: 1, review: 1.3, retry: 0.6, simulado: 1 },
  /** Tentativas para confiança plena. */
  confidenceAttempts: 15,
  /** Acertos por skill para contá-la como coberta. */
  skillCoveredAt: 2,
  repeatedMistakePenalty: 5,
  maxMistakePenalty: 20,
  levels: [
    { level: 2, score: 40 },
    { level: 3, score: 60 },
    { level: 4, score: 75 },
    { level: 5, score: 88 },
  ],
  hardCorrectForLevel4: 3,
  goodReviewsForLevel5: 1,
  distinctDaysForLevel5: 2,
} as const;

export const MASTERY_LEVEL_NAMES: Record<MasteryLevel, string> = {
  0: 'Não iniciado',
  1: 'Reconhecer',
  2: 'Aplicar',
  3: 'Diferenciar',
  4: 'Questões difíceis',
  5: 'Domínio',
};

/**
 * Calcula o domínio de um assunto a partir das tentativas dele (ordem cronológica).
 * O score combina precisão ponderada por recência/dificuldade/contexto, cobertura de
 * skills e confiança (volume); os níveis exigem também portões qualitativos.
 */
export function computeMastery(
  topic: Topic,
  topicAttempts: readonly Attempt[],
  topicMistakes: readonly Mistake[],
  goodReviews: number,
): Mastery {
  const c = MASTERY_CONFIG;
  const n = topicAttempts.length;
  if (n === 0) return { score: 0, level: 0 };

  let weighted = 0;
  let total = 0;
  topicAttempts.forEach((a, i) => {
    const age = n - 1 - i;
    const w =
      Math.pow(0.5, age / c.recencyHalfLife) *
      c.difficultyWeight[a.difficulty] *
      c.contextWeight[a.context];
    total += w;
    if (a.correct) weighted += w;
  });
  const accuracy = weighted / total;

  const correctBySkill = new Map<string, number>();
  for (const a of topicAttempts) {
    if (a.correct) correctBySkill.set(a.skillId, (correctBySkill.get(a.skillId) ?? 0) + 1);
  }
  const skillCount = Math.max(1, topic.skills.length);
  const covered = topic.skills.filter(
    (s) => (correctBySkill.get(s.id) ?? 0) >= c.skillCoveredAt,
  ).length;
  const coverage = covered / skillCount;

  const confidence = Math.min(1, n / c.confidenceAttempts);

  const repeated = topicMistakes.filter((m) => !m.resolved && m.count >= 2).length;
  const penalty = Math.min(c.maxMistakePenalty, repeated * c.repeatedMistakePenalty);

  const raw = 100 * accuracy * (0.6 + 0.4 * coverage) * confidence - penalty;
  const score = Math.round(Math.max(0, Math.min(100, raw)));

  return { score, level: levelFor(score, topic, topicAttempts, goodReviews) };
}

function levelFor(
  score: number,
  topic: Topic,
  attempts: readonly Attempt[],
  goodReviews: number,
): MasteryLevel {
  const c = MASTERY_CONFIG;
  const gates: Record<2 | 3 | 4 | 5, () => boolean> = {
    2: () => true,
    3: () => {
      const tried = new Set(attempts.map((a) => a.skillId));
      return topic.skills.every((s) => tried.has(s.id));
    },
    4: () =>
      attempts.filter((a) => a.correct && a.difficulty === 3).length >= c.hardCorrectForLevel4,
    5: () => {
      const days = new Set(
        attempts.filter((a) => a.correct).map((a) => new Date(a.at).toDateString()),
      );
      return goodReviews >= c.goodReviewsForLevel5 && days.size >= c.distinctDaysForLevel5;
    },
  };

  let level: MasteryLevel = 1;
  for (const step of c.levels) {
    if (score < step.score || !gates[step.level]()) break;
    level = step.level;
  }
  return level;
}

export function emptyProgress(topicId: string): Progress {
  return {
    topicId,
    attempts: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    mastery: { score: 0, level: 0 },
    review: { stage: 0, goodReviews: 0 },
    lessonsSeen: [],
  };
}

/** Precisão simples (para exibição): acertos / tentativas. */
export function accuracyOf(p: Progress | undefined): number | undefined {
  if (!p || p.attempts === 0) return undefined;
  return p.correctAnswers / p.attempts;
}
