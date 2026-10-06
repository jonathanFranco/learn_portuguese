import { describe, expect, it } from 'vitest';
import { buildCardDeck, cardStats, completeCardSession, DECK_CONFIG, gradeCard } from './flashcards';
import { createInitialState } from './study';
import { catalog, T0 } from './testing/fixtures';
import { DAY, MINUTE } from './time';
import { XP } from './xp';

const fresh = () => createInitialState('Ana', T0);

describe('gradeCard', () => {
  it('lembrou: sobe de caixa, reagenda e dá XP', () => {
    const s = gradeCard(fresh(), 'alpha-f1', 'good', T0);
    expect(s.cards['alpha-f1']).toMatchObject({ box: 1, dueAt: T0 + DAY, reviews: 1, lapses: 0 });
    expect(s.user.totalXp).toBe(XP.card);
  });

  it('fácil pula uma caixa', () => {
    const s = gradeCard(fresh(), 'alpha-f1', 'easy', T0);
    expect(s.cards['alpha-f1']).toMatchObject({ box: 2, dueAt: T0 + 3 * DAY });
  });

  it('errei: volta à caixa 0, vence na hora, sem XP; conta lapso só se já sabia', () => {
    let s = gradeCard(fresh(), 'alpha-f1', 'again', T0);
    expect(s.cards['alpha-f1']).toMatchObject({ box: 0, dueAt: T0, lapses: 0 });
    expect(s.user.totalXp).toBe(0);
    s = gradeCard(gradeCard(s, 'alpha-f1', 'good', T0), 'alpha-f1', 'again', T0 + DAY);
    expect(s.cards['alpha-f1']).toMatchObject({ box: 0, lapses: 1, reviews: 3 });
  });

  it('caixa não passa do máximo', () => {
    let s = fresh();
    for (let i = 0; i < 10; i++) s = gradeCard(s, 'alpha-f1', 'easy', T0);
    expect(s.cards['alpha-f1']!.box).toBe(5);
  });
});

describe('buildCardDeck', () => {
  it('assunto novo: cartões novos na ordem do conteúdo', () => {
    expect(buildCardDeck(fresh(), catalog, T0, 'alpha')).toEqual(['alpha-f1', 'alpha-f2', 'alpha-f3']);
  });

  it('vencidos primeiro (mais atrasado antes), não vencidos ficam de fora', () => {
    let s = gradeCard(fresh(), 'alpha-f2', 'good', T0); // vence T0+1d
    s = gradeCard(s, 'alpha-f1', 'easy', T0 - 5 * DAY); // vence T0-2d
    s = gradeCard(s, 'alpha-f3', 'easy', T0); // vence T0+3d
    expect(buildCardDeck(s, catalog, T0 + DAY, 'alpha')).toEqual(['alpha-f1', 'alpha-f2']);
  });

  it('sem assunto: novos de todos os assuntos, na ordem da trilha', () => {
    expect(buildCardDeck(fresh(), catalog, T0)).toEqual(['alpha-f1', 'alpha-f2', 'alpha-f3', 'beta-f1', 'gamma-f1']);
  });

  it('limita cartões novos por sessão', () => {
    expect(buildCardDeck(fresh(), catalog, T0).length).toBeLessThanOrEqual(DECK_CONFIG.newPerSession);
  });
});

describe('cardStats', () => {
  it('conta novos, vencidos e sabidos', () => {
    let s = gradeCard(fresh(), 'alpha-f1', 'easy', T0);
    s = gradeCard(s, 'alpha-f2', 'again', T0);
    expect(cardStats(s, catalog, T0, 'alpha')).toEqual({ total: 3, due: 1, fresh: 1, learned: 1 });
  });
});

describe('completeCardSession', () => {
  it('conta o dia na sequência e o tempo (limitado por cartão)', () => {
    const { state } = completeCardSession(fresh(), { startedAt: T0, reviewed: 3 }, T0 + 60 * MINUTE);
    expect(state.streak.current).toBe(1);
    expect(Object.values(state.dailyLog)[0]!.minutes).toBe(6);
    expect(state.user.lastStudiedAt).toBe(T0 + 60 * MINUTE);
  });

  it('sessão vazia não conta', () => {
    const s = fresh();
    expect(completeCardSession(s, { startedAt: T0, reviewed: 0 }, T0).state).toBe(s);
  });
});
