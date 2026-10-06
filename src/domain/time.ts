export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/** Chave de dia no fuso local: 'YYYY-MM-DD'. */
export function dayKey(at: number): string {
  const d = new Date(at);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Diferença em dias de calendário local entre duas chaves 'YYYY-MM-DD'. */
export function daysBetweenKeys(from: string, to: string): number {
  const parse = (k: string) => {
    const [y, m, d] = k.split('-').map(Number) as [number, number, number];
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((parse(to) - parse(from)) / DAY);
}

export function daysSince(at: number | undefined, now: number): number | undefined {
  return at === undefined ? undefined : Math.max(0, (now - at) / DAY);
}
