import type { ReactNode } from 'react';
import styles from './Pill.module.css';

export function Pill({ icon, children, label }: { icon: string; children: ReactNode; label?: string }) {
  return (
    <span className={styles.pill} aria-label={label}>
      <span aria-hidden>{icon}</span>
      {children}
    </span>
  );
}
