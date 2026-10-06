import { Fragment, type ReactNode } from 'react';
import styles from './RichText.module.css';

/** **negrito**, _itálico_, `destaque`. Parágrafos separados por linha em branco. Sem HTML. */
const TOKEN = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g;

function inline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return <mark key={i} className={styles.mark}>{part.slice(1, -1)}</mark>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Uma linha de texto curto (alternativa, resposta) com a mesma marcação, sem parágrafo. */
export function InlineText({ text }: { text: string }) {
  return <>{inline(text)}</>;
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/);
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.split('\n').map((line, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {inline(line)}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
