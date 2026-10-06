import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  /** 0–1 */
  value: number;
  label: string;
  tone?: 'brand' | 'accent';
  size?: 'sm' | 'md';
  /** Marcadores (0–1), ex.: limiares dos níveis de domínio. */
  ticks?: readonly number[];
}

export function ProgressBar({ value, label, tone = 'brand', size = 'md', ticks }: ProgressBarProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div
      className={`${styles.track} ${styles[size]}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className={`${styles.fill} ${styles[tone]}`} style={{ width: `${pct}%` }} />
      {ticks?.map((t) => (
        <span key={t} className={styles.tick} style={{ left: `${t * 100}%` }} aria-hidden />
      ))}
    </div>
  );
}
