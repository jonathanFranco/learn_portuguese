/** 1:05:09 · 4:09 */
export function clock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

export function minutesLabel(ms: number): string {
  const min = Math.max(1, Math.round(ms / 60_000));
  return `${min} min`;
}
