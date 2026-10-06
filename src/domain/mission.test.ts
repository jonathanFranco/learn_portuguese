import { describe, expect, it } from 'vitest';
import { buildMission, findSimilarQuestion, questionIdsOf } from './mission';
import { createInitialState } from './study';
import { catalog, T0 } from './testing/fixtures';
import type { UserState } from './types';

const fresh = () => createInitialState('Ana', T0);

describe('buildMission', () => {
  it('learn: lição → prática → exemplo → interleave → desafio', () => {
    const m = buildMission('learn', 'alpha', fresh(), catalog);
    expect(m.title).toBe('Aprender: Regra A1');
    expect(m.steps.map((s) => (s.kind === 'question' ? s.role : s.kind))).toEqual([
      'lesson',
      'practice',
      'practice',
      'example',
      'practice', // sem outro assunto estudado, o interleave usa o próprio assunto
      'challenge',
    ]);
    expect(m.estimatedMinutes).toBeGreaterThanOrEqual(3);
    expect(m.estimatedMinutes).toBeLessThanOrEqual(10);
  });

  it('é determinística e não repete questões', () => {
    const a = buildMission('practice', 'alpha', fresh(), catalog);
    const b = buildMission('practice', 'alpha', fresh(), catalog);
    expect(a).toEqual(b);
    const ids = questionIdsOf(a);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('pula lições já vistas', () => {
    const s = fresh();
    s.progress.alpha = { ...emptyAlpha(), lessonsSeen: ['alpha-l1'] };
    expect(buildMission('learn', 'alpha', s, catalog).title).toBe('Aprender: Regra A2');
  });

  it('interleave usa outro assunto já estudado', () => {
    const s = fresh();
    s.progress.beta = { ...emptyAlpha(), topicId: 'beta', attempts: 3 };
    const m = buildMission('practice', 'alpha', s, catalog);
    const inter = m.steps.find((st) => st.kind === 'question' && st.role === 'interleave');
    expect(inter && catalog.questionById.get((inter as { questionId: string }).questionId)?.topicId).toBe('beta');
  });

  it('review/weak_spot reapresentam erros não resolvidos', () => {
    const s: UserState = {
      ...fresh(),
      mistakes: {
        'a2-2': { questionId: 'a2-2', topicId: 'alpha', skillId: 'a2', count: 3, lastWrongAt: T0, resolved: false },
        'a1-1': { questionId: 'a1-1', topicId: 'alpha', skillId: 'a1', count: 1, lastWrongAt: T0, resolved: true },
      },
    };
    const review = buildMission('review', 'alpha', s, catalog);
    expect(review.steps[0]).toEqual({ kind: 'mistake_review', questionId: 'a2-2' });
    expect(review.steps.some((st) => 'questionId' in st && st.questionId === 'a1-1' && st.kind === 'mistake_review')).toBe(false);
  });

  it('weak_spot foca a skill com menor precisão', () => {
    const s = fresh();
    s.attempts = [
      { questionId: 'a1-1', topicId: 'alpha', skillId: 'a1', answer: 'A', correct: true, difficulty: 1, context: 'mission', at: T0, durationMs: 1 },
      { questionId: 'a2-1', topicId: 'alpha', skillId: 'a2', answer: 'B', correct: false, difficulty: 1, context: 'mission', at: T0, durationMs: 1 },
    ];
    const m = buildMission('weak_spot', 'alpha', s, catalog);
    expect(m.title).toBe('Reforçar: A2');
    expect(m.steps[0]).toEqual({ kind: 'lesson', lessonId: 'alpha-l2' });
  });
});

describe('findSimilarQuestion', () => {
  it('mesma skill, outra questão, sem as excluídas, dificuldade ≤ original', () => {
    const q = catalog.questionById.get('a1-3')!;
    const similar = findSimilarQuestion(q, catalog, new Set(['a1-1']), 'seed');
    expect(similar?.id).toBe('a1-2');
    expect(findSimilarQuestion(q, catalog, new Set(['a1-1', 'a1-2', 'a1-4', 'a1-5']), 's')).toBeUndefined();
  });
});

function emptyAlpha() {
  return {
    topicId: 'alpha',
    attempts: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    mastery: { score: 0, level: 0 as const },
    review: { stage: 0, goodReviews: 0 },
    lessonsSeen: [] as string[],
  };
}
