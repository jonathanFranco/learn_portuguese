import type { ReactNode } from 'react';
import { useHotkeys } from '../../hooks/useHotkeys';
import styles from './Session.module.css';

/** Barra de ações fixa na base (alcance do polegar). Enter dispara a ação principal. */
export function StepActions({ onPrimary, children }: { onPrimary: () => void; children: ReactNode }) {
  useHotkeys({ Enter: onPrimary });
  return <div className={styles.actions}>{children}</div>;
}
