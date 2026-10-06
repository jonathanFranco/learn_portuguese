import type { ReactNode } from 'react';
import styles from './ChoiceButton.module.css';

export type ChoiceState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

const MARK: Partial<Record<ChoiceState, string>> = { correct: '✓', wrong: '✕' };
const SR: Partial<Record<ChoiceState, string>> = { correct: ' (correta)', wrong: ' (sua resposta, incorreta)' };

interface ChoiceButtonProps {
  badge?: string;
  state?: ChoiceState;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

/** Alternativa de resposta. Estado comunicado por cor E ícone (não só cor). */
export function ChoiceButton({ badge, state = 'idle', disabled, onClick, children }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      data-choice
      className={`${styles.choice} ${styles[state]}`}
      disabled={disabled}
      aria-pressed={state === 'selected'}
      onClick={onClick}
    >
      {badge && <span className={styles.badge} aria-hidden>{MARK[state] ?? badge}</span>}
      <span className={styles.text}>
        {children}
        {SR[state] && <span className={styles.sr}>{SR[state]}</span>}
      </span>
    </button>
  );
}
