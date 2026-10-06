import type { CSSProperties } from 'react';
import styles from './Confetti.module.css';

const COLORS = ['var(--brand)', 'var(--accent)', 'var(--correct)', '#e8a33d', '#5b8def'];

// Fixo (não aleatório a cada render): mesmas peças, ângulos espalhados em leque.
const PIECES = Array.from({ length: 22 }, (_, i) => {
  const angle = -150 + (i * 120) / 21 + ((i * 37) % 11) - 5;
  const distance = 110 + ((i * 53) % 90);
  return {
    color: COLORS[i % COLORS.length]!,
    x: Math.cos((angle * Math.PI) / 180) * distance,
    y: Math.sin((angle * Math.PI) / 180) * distance,
    spin: ((i * 97) % 540) - 270,
    delay: (i % 5) * 30,
    round: i % 3 === 0,
  };
});

/** Explosão de confete a partir do centro do pai. Decorativo; some sozinho. */
export function Confetti() {
  return (
    <span className={styles.burst} aria-hidden>
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={`${styles.piece} ${p.round ? styles.round : ''}`}
          style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, '--spin': `${p.spin}deg`, '--c': p.color, animationDelay: `${p.delay}ms` } as CSSProperties}
        />
      ))}
    </span>
  );
}
