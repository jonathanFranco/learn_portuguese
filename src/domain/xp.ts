import type { Difficulty } from './types';

export const XP = {
  correct: 10,
  correctHard: 20,
  retryCorrect: 5,
  missionComplete: 50,
  topicMastered: 100,
  /** Cartão lembrado (não conta "Errei"). */
  card: 2,
} as const;

export function xpForAnswer(correct: boolean, difficulty: Difficulty, isRetry: boolean): number {
  if (!correct) return 0;
  if (isRetry) return XP.retryCorrect;
  return difficulty === 3 ? XP.correctHard : XP.correct;
}

/** XP acumulado necessário para atingir o nível n (n ≥ 1). Nível 1 = 0 XP. */
export function xpForLevel(level: number): number {
  const n = level - 1;
  return (100 * n * (n + 1)) / 2;
}

export interface LevelInfo {
  level: number;
  /** XP dentro do nível atual. */
  current: number;
  /** XP total do nível atual até o próximo. */
  span: number;
}

export function levelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXp) level++;
  const base = xpForLevel(level);
  return { level, current: totalXp - base, span: xpForLevel(level + 1) - base };
}
