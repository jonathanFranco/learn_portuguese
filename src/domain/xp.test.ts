import { describe, expect, it } from 'vitest';
import { levelFromXp, xpForAnswer } from './xp';

describe('xp', () => {
  it('pontua acerto, difícil, retry; erro vale 0', () => {
    expect(xpForAnswer(true, 1, false)).toBe(10);
    expect(xpForAnswer(true, 3, false)).toBe(20);
    expect(xpForAnswer(true, 3, true)).toBe(5);
    expect(xpForAnswer(false, 3, false)).toBe(0);
  });
  it('curva de nível', () => {
    expect(levelFromXp(0)).toEqual({ level: 1, current: 0, span: 100 });
    expect(levelFromXp(99).level).toBe(1);
    expect(levelFromXp(100)).toEqual({ level: 2, current: 0, span: 200 });
    expect(levelFromXp(350)).toEqual({ level: 3, current: 50, span: 300 });
  });
});
