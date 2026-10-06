import { describe, expect, it } from 'vitest';
import { computeMastery } from './mastery';
import { DAY } from './time';
import { catalog, T0 } from './testing/fixtures';
import type { Attempt, Difficulty } from './types';

const alpha = catalog.topicById.get('alpha')!;

function attempts(spec: readonly (readonly [skillId: string, correct: boolean, difficulty?: Difficulty])[], at = T0): Attempt[] {
  return spec.map(([skillId, correct, difficulty = 1], i) => ({
    questionId: `${skillId}-${i}`,
    topicId: 'alpha',
    skillId,
    answer: correct ? 'A' : 'B',
    correct,
    difficulty,
    context: 'mission',
    at: at + i,
    durationMs: 1000,
  }));
}

const repeat = <T>(n: number, item: T): T[] => Array.from({ length: n }, () => item);

describe('computeMastery', () => {
  it('sem tentativas = 0 / nível 0', () => {
    expect(computeMastery(alpha, [], [], 0)).toEqual({ score: 0, level: 0 });
  });

  it('poucas questões não dão domínio alto (confiança)', () => {
    const m = computeMastery(alpha, attempts([['a1', true], ['a2', true]]), [], 0);
    expect(m.score).toBeLessThan(20);
    expect(m.level).toBe(1);
  });

  it('erros recentes pesam mais que antigos', () => {
    const oldErrors = attempts([...repeat(10, ['a1', false] as const), ...repeat(10, ['a1', true] as const)]);
    const newErrors = attempts([...repeat(10, ['a1', true] as const), ...repeat(10, ['a1', false] as const)]);
    expect(computeMastery(alpha, oldErrors, [], 0).score).toBeGreaterThan(
      computeMastery(alpha, newErrors, [], 0).score + 20,
    );
  });

  it('nível 3 exige todas as skills tentadas', () => {
    const onlyA1 = attempts(repeat(20, ['a1', true] as const));
    expect(computeMastery(alpha, onlyA1, [], 0).level).toBe(2);
    const both = attempts([...repeat(10, ['a1', true] as const), ...repeat(10, ['a2', true] as const)]);
    expect(computeMastery(alpha, both, [], 0).level).toBe(3);
  });

  it('nível 4 exige acertos difíceis; nível 5 exige revisão e dias diferentes', () => {
    const spec = [...repeat(10, ['a1', true, 3] as const), ...repeat(10, ['a2', true, 3] as const)];
    const sameDay = attempts(spec);
    expect(computeMastery(alpha, sameDay, [], 0).level).toBe(4);
    expect(computeMastery(alpha, sameDay, [], 1).level).toBe(4); // um dia só
    const twoDays = [...attempts(spec.slice(0, 10)), ...attempts(spec.slice(10), T0 + DAY)];
    expect(computeMastery(alpha, twoDays, [], 1)).toEqual({ score: 100, level: 5 });
  });

  it('erros repetidos não resolvidos reduzem o score', () => {
    const a = attempts([...repeat(10, ['a1', true] as const), ...repeat(10, ['a2', true] as const)]);
    const mistake = { questionId: 'x', topicId: 'alpha', skillId: 'a1', count: 2, lastWrongAt: T0, resolved: false };
    expect(computeMastery(alpha, a, [mistake], 0).score).toBe(computeMastery(alpha, a, [], 0).score - 5);
  });
});
