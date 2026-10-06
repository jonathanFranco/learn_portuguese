import { useEffect, useState } from 'react';

/** Conta de 0 até `target` em `ms` (ease-out). Com movimento reduzido, mostra o valor direto. */
export function useCountUp(target: number, ms = 900): number {
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [value, setValue] = useState(reduce ? target : 0);
  useEffect(() => {
    if (reduce) return setValue(target);
    let frame = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setValue(Math.round(target * (1 - (1 - p) ** 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, ms, reduce]);
  return value;
}
