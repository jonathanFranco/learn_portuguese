import { describe, expect, it } from 'vitest';
import { registerStudyDay, visibleStreak } from './streak';
import { DAY } from './time';
import { T0 } from './testing/fixtures';

describe('streak', () => {
  it('soma dias seguidos, ignora o mesmo dia, reinicia sem perder o recorde', () => {
    let s = registerStudyDay({ current: 0, best: 0 }, T0);
    s = registerStudyDay(s, T0 + 2 * 3600_000);
    expect(s.current).toBe(1);
    s = registerStudyDay(s, T0 + DAY);
    s = registerStudyDay(s, T0 + 2 * DAY);
    expect(s).toMatchObject({ current: 3, best: 3 });
    s = registerStudyDay(s, T0 + 5 * DAY);
    expect(s).toMatchObject({ current: 1, best: 3 });
  });
  it('sequência visível zera depois de um dia sem estudo', () => {
    const s = registerStudyDay({ current: 0, best: 0 }, T0);
    expect(visibleStreak(s, T0 + DAY)).toBe(1);
    expect(visibleStreak(s, T0 + 2 * DAY)).toBe(0);
  });
});
