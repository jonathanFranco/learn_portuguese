import { describe, expect, it } from 'vitest';
import { answerLabel, correctAnswerLabel, explainMistake, isCorrect } from './answer';
import type { Question } from './types';

const base = { id: 'q', topicId: 't', skillId: 's', difficulty: 1 as const, statement: '', explanation: 'geral' };

describe('isCorrect', () => {
  it('corrige cada tipo', () => {
    const qs: [Question, unknown, unknown][] = [
      [{ ...base, type: 'multiple_choice', alternatives: [{ id: 'A', text: 'a' }, { id: 'B', text: 'b' }], correct: 'B' }, 'B', 'A'],
      [{ ...base, type: 'true_false', correct: false }, false, true],
      [{ ...base, type: 'fill_blank', template: 'Vou ___ escola.', options: ['a', 'à'], correct: 'à' }, 'à', 'a'],
      [{ ...base, type: 'identify_error', segments: ['Fazem', 'dois anos'], correct: 0 }, 0, 1],
      [{ ...base, type: 'order', items: ['b', 'a'], correct: ['a', 'b'] }, ['a', 'b'], ['b', 'a']],
      [{ ...base, type: 'match', pairs: [['x', '1'], ['y', '2']] }, ['x→1', 'y→2'], ['x→2', 'y→1']],
    ];
    for (const [q, right, wrong] of qs) {
      expect(isCorrect(q, right as never), q.type).toBe(true);
      expect(isCorrect(q, wrong as never), q.type).toBe(false);
    }
  });

  it('formato errado conta como erro, não quebra', () => {
    expect(isCorrect({ ...base, type: 'order', items: ['a'], correct: ['a'] }, 'a')).toBe(false);
  });
});

describe('explicações', () => {
  const q: Question = {
    ...base,
    type: 'multiple_choice',
    alternatives: [
      { id: 'A', text: 'certa' },
      { id: 'B', text: 'errada', whyWrong: 'específica' },
      { id: 'C', text: 'outra' },
    ],
    correct: 'A',
  };
  it('usa whyWrong do distrator, senão a explicação geral', () => {
    expect(explainMistake(q, 'B')).toBe('específica');
    expect(explainMistake(q, 'C')).toBe('geral');
  });
  it('rótulos', () => {
    expect(correctAnswerLabel(q)).toBe('A) certa');
    expect(answerLabel(q, 'B')).toBe('B) errada');
  });
});
