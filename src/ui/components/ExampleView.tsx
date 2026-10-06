import type { Example } from '../../domain/types';
import { RichText } from './RichText';
import styles from './ExampleView.module.css';

export function ExampleView({ example }: { example: Example }) {
  return (
    <figure className={styles.example}>
      <p className={styles.sentence}>{example.sentence}</p>
      {example.breakdown && (
        <ol className={styles.breakdown}>
          {example.breakdown.map((line, i) => (
            <li key={i}><RichText text={line} /></li>
          ))}
        </ol>
      )}
      {example.note && <figcaption className={styles.note}><RichText text={example.note} /></figcaption>}
    </figure>
  );
}
