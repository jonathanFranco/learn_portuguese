import { describe, expect, it } from 'vitest';
import { afterMistake, afterReviewSession, isReviewDue, maybeEnterReview } from './review';
import { DAY } from './time';
import { T0 } from './testing/fixtures';

describe('revisão espaçada', () => {
  const fresh = { stage: 0, goodReviews: 0 };

  it('entra no ciclo no nível 2, com revisão em 1 dia', () => {
    expect(maybeEnterReview(fresh, 1, T0)).toBe(fresh);
    const r = maybeEnterReview(fresh, 2, T0);
    expect(r.nextReviewAt).toBe(T0 + DAY);
    expect(isReviewDue(r, T0 + DAY - 1)).toBe(false);
    expect(isReviewDue(r, T0 + DAY)).toBe(true);
  });

  it('sobe com boa revisão, mantém com média, desce com ruim', () => {
    const r0 = maybeEnterReview(fresh, 2, T0);
    const good = afterReviewSession(r0, 0.9, T0 + DAY);
    expect(good).toMatchObject({ stage: 1, goodReviews: 1, nextReviewAt: T0 + DAY + 3 * DAY });
    const good2 = afterReviewSession(good, 1, T0 + 4 * DAY);
    expect(good2.stage).toBe(2);
    expect(afterReviewSession(good2, 0.6, T0).stage).toBe(2);
    expect(afterReviewSession(good2, 0.3, T0).stage).toBe(1);
  });

  it('não passa do último intervalo nem fica abaixo de zero', () => {
    let r = maybeEnterReview(fresh, 2, T0);
    for (let i = 0; i < 10; i++) r = afterReviewSession(r, 1, T0);
    expect(r).toMatchObject({ stage: 4, nextReviewAt: T0 + 30 * DAY });
    r = maybeEnterReview(fresh, 2, T0);
    expect(afterReviewSession(r, 0, T0).stage).toBe(0);
  });

  it('erro encurta o intervalo sem adiar revisão vencida', () => {
    const r = { stage: 3, nextReviewAt: T0 + 14 * DAY, goodReviews: 2 };
    expect(afterMistake(r, T0)).toMatchObject({ stage: 2, nextReviewAt: T0 + 7 * DAY });
    const overdue = { stage: 3, nextReviewAt: T0 - DAY, goodReviews: 2 };
    expect(afterMistake(overdue, T0).nextReviewAt).toBe(T0 - DAY);
  });
});
