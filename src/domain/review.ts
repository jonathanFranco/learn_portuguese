import { DAY } from './time';
import type { MasteryLevel, ReviewState } from './types';

/** Isolado para futura troca por FSRS/SM-2. */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30] as const;
export const REVIEW_ENTRY_LEVEL: MasteryLevel = 2;
const GOOD = 0.8;
const POOR = 0.5;

function schedule(stage: number, now: number): number {
  const i = Math.max(0, Math.min(stage, REVIEW_INTERVALS_DAYS.length - 1));
  return now + REVIEW_INTERVALS_DAYS[i]! * DAY;
}

/** Entra no ciclo quando o assunto atinge o nível de entrada. */
export function maybeEnterReview(review: ReviewState, level: MasteryLevel, now: number): ReviewState {
  if (review.nextReviewAt !== undefined || level < REVIEW_ENTRY_LEVEL) return review;
  return { ...review, stage: 0, nextReviewAt: schedule(0, now) };
}

/** Após uma missão de revisão: sobe, mantém ou desce o intervalo. */
export function afterReviewSession(review: ReviewState, accuracy: number, now: number): ReviewState {
  if (review.nextReviewAt === undefined) return review;
  const max = REVIEW_INTERVALS_DAYS.length - 1;
  if (accuracy >= GOOD) {
    const stage = Math.min(max, review.stage + 1);
    return { stage, nextReviewAt: schedule(stage, now), goodReviews: review.goodReviews + 1 };
  }
  const stage = accuracy < POOR ? Math.max(0, review.stage - 1) : review.stage;
  return { ...review, stage, nextReviewAt: schedule(stage, now) };
}

/** Erro fora da revisão: encurta o intervalo, sem adiar uma revisão já vencida. */
export function afterMistake(review: ReviewState, now: number): ReviewState {
  if (review.nextReviewAt === undefined || review.stage === 0) return review;
  const stage = review.stage - 1;
  return { ...review, stage, nextReviewAt: Math.min(review.nextReviewAt, schedule(stage, now)) };
}

/** Dias de atraso (0 se não vencida ou fora do ciclo). */
export function reviewOverdueDays(review: ReviewState, now: number): number {
  if (review.nextReviewAt === undefined || now < review.nextReviewAt) return 0;
  return (now - review.nextReviewAt) / DAY;
}

export function isReviewDue(review: ReviewState, now: number): boolean {
  return review.nextReviewAt !== undefined && now >= review.nextReviewAt;
}
