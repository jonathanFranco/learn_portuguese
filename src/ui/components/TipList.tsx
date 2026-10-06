import type { Tip, TipKind } from '../../domain/types';
import { RichText } from './RichText';
import styles from './TipList.module.css';

const LABEL: Record<TipKind, { icon: string; title: string }> = {
  cobranca: { icon: '🎯', title: 'Como costuma cair' },
  pegadinha: { icon: '⚠️', title: 'Pegadinha' },
  macete: { icon: '⚡', title: 'Macete' },
};

/** Dicas de prova de uma lição, na ordem: cobrança → pegadinha → macete. */
export function TipList({ tips }: { tips: Tip[] }) {
  if (tips.length === 0) return null;
  const ordered = (['cobranca', 'pegadinha', 'macete'] as const).flatMap((k) => tips.filter((t) => t.kind === k));
  return (
    <ul className={styles.list} aria-label="Dicas de prova">
      {ordered.map((tip, i) => (
        <li key={i} className={`${styles.tip} ${styles[tip.kind]}`}>
          <p className={styles.kind}>
            <span aria-hidden>{LABEL[tip.kind].icon}</span> {LABEL[tip.kind].title}
          </p>
          <RichText text={tip.text} />
        </li>
      ))}
    </ul>
  );
}
