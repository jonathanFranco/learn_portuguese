import { MASTERY_CONFIG, MASTERY_LEVEL_NAMES } from '../../domain/mastery';
import type { Mastery } from '../../domain/types';
import { ProgressBar } from './ProgressBar';
import styles from './MasteryBar.module.css';

const TICKS = MASTERY_CONFIG.levels.map((l) => l.score / 100);

interface MasteryBarProps {
  name: string;
  mastery: Mastery;
  /** Linha de detalhes opcional, ex.: "84% de precisão · 37 questões". */
  detail?: string;
}

export function MasteryBar({ name, mastery, detail }: MasteryBarProps) {
  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <span className={styles.name}>{name}</span>
        <span className={styles.score}>{mastery.score}%</span>
      </div>
      <ProgressBar value={mastery.score / 100} label={`Domínio de ${name}`} ticks={TICKS} />
      <div className={styles.meta}>
        <span>{MASTERY_LEVEL_NAMES[mastery.level]}</span>
        {detail && <span>{detail}</span>}
      </div>
    </div>
  );
}
