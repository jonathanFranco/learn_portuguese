import type { Achievement, UserState } from './types';

interface AchievementRule extends Achievement {
  check(state: UserState): boolean;
}

const RULES: AchievementRule[] = [
  {
    id: 'first_step',
    title: 'Primeiro passo',
    description: 'Concluiu a primeira missão.',
    icon: '🌱',
    check: (s) => s.user.missionsCompleted >= 1,
  },
  {
    id: 'streak_3',
    title: '3 dias de estudo',
    description: 'Estudou em 3 dias seguidos.',
    icon: '🔥',
    check: (s) => s.streak.best >= 3,
  },
  {
    id: 'streak_7',
    title: '7 dias de estudo',
    description: 'Estudou em 7 dias seguidos.',
    icon: '🌿',
    check: (s) => s.streak.best >= 7,
  },
  {
    id: 'ten_in_a_row',
    title: '10 acertos seguidos',
    description: 'Acertou 10 questões em sequência.',
    icon: '🎯',
    check: (s) => s.attempts.length >= 10 && s.attempts.slice(-10).every((a) => a.correct),
  },
  {
    id: 'recovery',
    title: 'Volta por cima',
    description: 'Acertou 5 questões que já tinha errado.',
    icon: '🔁',
    check: (s) => Object.values(s.mistakes).filter((m) => m.resolved).length >= 5,
  },
  {
    id: 'first_mastery',
    title: 'Primeiro assunto dominado',
    description: 'Chegou ao nível Domínio em um assunto.',
    icon: '🏅',
    check: (s) => Object.values(s.progress).some((p) => p.masteredAt !== undefined),
  },
  {
    id: 'cards_100',
    title: 'Memória afiada',
    description: 'Revisou 100 cartões.',
    icon: '🗂️',
    check: (s) => Object.values(s.cards).reduce((n, c) => n + c.reviews, 0) >= 100,
  },
  {
    id: 'crase_master',
    title: 'Mestre da Crase',
    description: 'Dominou Crase.',
    icon: '👑',
    check: (s) => s.progress['crase']?.masteredAt !== undefined,
  },
];

export const ACHIEVEMENTS: readonly Achievement[] = RULES.map(({ check: _, ...a }) => a);

/** Desbloqueia o que passou a valer. Retorna o novo estado e os ids desbloqueados agora. */
export function unlockAchievements(
  state: UserState,
  now: number,
): { state: UserState; unlocked: string[] } {
  const unlocked = RULES.filter((r) => state.achievements[r.id] === undefined && r.check(state)).map(
    (r) => r.id,
  );
  if (unlocked.length === 0) return { state, unlocked };
  const achievements = { ...state.achievements };
  for (const id of unlocked) achievements[id] = now;
  return { state: { ...state, achievements }, unlocked };
}
