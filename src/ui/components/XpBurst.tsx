import styles from './XpBurst.module.css';

/** "+10 XP" que sobe e some. Decorativo: o valor também aparece em texto para leitores de tela. */
export function XpBurst({ xp }: { xp: number }) {
  if (xp <= 0) return null;
  return (
    <span className={styles.burst}>
      <span aria-hidden>+{xp} XP</span>
      <span className={styles.sr}>Você ganhou {xp} XP</span>
    </span>
  );
}
