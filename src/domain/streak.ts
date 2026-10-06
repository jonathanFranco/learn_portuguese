import { daysBetweenKeys, dayKey } from './time';
import type { StreakState } from './types';

/** Registra um dia com missão concluída. Quebra de sequência só reinicia `current`; `best` fica. */
export function registerStudyDay(streak: StreakState, now: number): StreakState {
  const today = dayKey(now);
  if (streak.lastDay === today) return streak;
  const gap = streak.lastDay ? daysBetweenKeys(streak.lastDay, today) : Infinity;
  const current = gap === 1 ? streak.current + 1 : 1;
  return { current, best: Math.max(streak.best, current), lastDay: today };
}

/** Sequência para exibição: só conta se o último dia foi hoje ou ontem. */
export function visibleStreak(streak: StreakState, now: number): number {
  if (!streak.lastDay) return 0;
  return daysBetweenKeys(streak.lastDay, dayKey(now)) <= 1 ? streak.current : 0;
}
