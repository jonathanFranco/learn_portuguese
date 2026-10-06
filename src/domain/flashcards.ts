// Flashcards com revisão espaçada por cartão (caixas de Leitner). Funções puras.

import { unlockAchievements } from './achievements';
import { registerStudyDay } from './streak';
import { addDayXp } from './study';
import { DAY, dayKey, MINUTE } from './time';
import { XP } from './xp';
import type { CardGrade, CardState, Catalog, UserState } from './types';

/** Intervalo de cada caixa. Caixa 0 = aprendendo (volta ainda na mesma sessão). */
export const CARD_INTERVALS_DAYS = [0, 1, 3, 7, 16, 35] as const;
/** Caixa a partir da qual o cartão conta como "sabido". */
export const CARD_LEARNED_BOX = 2;

export const DECK_CONFIG = {
  /** Cartões por sessão. */
  size: 20,
  /** Cartões novos por sessão (o resto é revisão). */
  newPerSession: 10,
  /** Tempo máximo contado por cartão (app esquecido aberto). */
  timePerCardCap: 2 * MINUTE,
} as const;

const MAX_BOX = CARD_INTERVALS_DAYS.length - 1;

function nextBox(card: CardState | undefined, grade: CardGrade): number {
  if (grade === 'again') return 0;
  const box = card?.box ?? 0;
  return Math.min(MAX_BOX, box + (grade === 'easy' ? 2 : 1));
}

/** Daqui a quantos dias o cartão volta com esta nota (0 = ainda nesta sessão). */
export function nextIntervalDays(card: CardState | undefined, grade: CardGrade): number {
  return CARD_INTERVALS_DAYS[nextBox(card, grade)]!;
}

/** Registra a nota de um cartão: move de caixa, reagenda e dá XP se lembrou. */
export function gradeCard(state: UserState, cardId: string, grade: CardGrade, now: number): UserState {
  const prev = state.cards[cardId];
  const box = nextBox(prev, grade);
  const card: CardState = {
    box,
    dueAt: now + CARD_INTERVALS_DAYS[box]! * DAY,
    reviews: (prev?.reviews ?? 0) + 1,
    lapses: (prev?.lapses ?? 0) + (grade === 'again' && (prev?.box ?? 0) > 0 ? 1 : 0),
    lastAt: now,
  };
  const xp = grade === 'again' ? 0 : XP.card;
  return {
    ...state,
    cards: { ...state.cards, [cardId]: card },
    user: { ...state.user, totalXp: state.user.totalXp + xp },
    dailyLog: addDayXp(state.dailyLog, now, xp),
  };
}

/** Fecha uma sessão de cartões: conta o dia de estudo e o tempo. */
export function completeCardSession(
  state: UserState,
  session: { startedAt: number; reviewed: number },
  now: number,
): { state: UserState; unlocked: string[] } {
  if (session.reviewed === 0) return { state, unlocked: [] };
  const elapsed = Math.min(now - session.startedAt, session.reviewed * DECK_CONFIG.timePerCardCap);
  const minutes = Math.max(1, Math.round(elapsed / MINUTE));
  const key = dayKey(now);
  const day = state.dailyLog[key] ?? { minutes: 0, xp: 0, missions: 0 };
  return unlockAchievements(
    {
      ...state,
      user: { ...state.user, lastStudiedAt: now },
      streak: registerStudyDay(state.streak, now),
      dailyLog: { ...state.dailyLog, [key]: { ...day, minutes: day.minutes + minutes } },
    },
    now,
  );
}

/**
 * Monta a sessão: revisões vencidas primeiro (as mais atrasadas antes), depois cartões novos
 * na ordem da trilha e das lições.
 */
export function buildCardDeck(state: UserState, catalog: Catalog, now: number, topicId?: string): string[] {
  const pool = topicId ? (catalog.flashcardsByTopic.get(topicId) ?? []) : catalog.flashcards;
  const seenDue = pool
    .filter((c) => {
      const s = state.cards[c.id];
      return s !== undefined && s.dueAt <= now;
    })
    .sort((a, b) => state.cards[a.id]!.dueAt - state.cards[b.id]!.dueAt)
    .map((c) => c.id);
  const fresh = pool
    .filter((c) => state.cards[c.id] === undefined)
    .slice(0, DECK_CONFIG.newPerSession)
    .map((c) => c.id);
  return [...seenDue, ...fresh].slice(0, DECK_CONFIG.size);
}

export interface CardStats {
  total: number;
  /** Vencidos para hoje. */
  due: number;
  fresh: number;
  learned: number;
}

export function cardStats(state: UserState, catalog: Catalog, now: number, topicId?: string): CardStats {
  const cards = topicId ? (catalog.flashcardsByTopic.get(topicId) ?? []) : catalog.flashcards;
  const stats: CardStats = { total: cards.length, due: 0, fresh: 0, learned: 0 };
  for (const c of cards) {
    const s = state.cards[c.id];
    if (!s) stats.fresh++;
    else {
      if (s.dueAt <= now) stats.due++;
      if (s.box >= CARD_LEARNED_BOX) stats.learned++;
    }
  }
  return stats;
}
