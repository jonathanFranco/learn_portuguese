import type { Answer } from '../../domain/types';
import { ChoiceButton } from '../components/ChoiceButton';
import { InlineText } from '../components/RichText';
import { choiceState, choicesOf, type ChoiceQuestion, type ChoiceView } from './choices';
import styles from './Exercise.module.css';

interface ExerciseProps extends ChoiceView {
  question: ChoiceQuestion;
  onSelect(value: Answer): void;
}

/** Área de resposta. Um renderer por tipo; correção e estado ficam fora. */
export function Exercise(props: ExerciseProps) {
  switch (props.question.type) {
    case 'fill_blank':
      return <FillBlank {...props} question={props.question} />;
    case 'identify_error':
      return <IdentifyError {...props} question={props.question} />;
    default:
      return <ChoiceList {...props} />;
  }
}

function ChoiceList({ question, onSelect, ...view }: ExerciseProps) {
  const locked = view.answered !== undefined;
  return (
    <div className={styles.list} role="group" aria-label="Alternativas">
      {choicesOf(question).map((c) => (
        <ChoiceButton
          key={String(c.value)}
          badge={c.badge}
          state={choiceState(question, c.value, view)}
          disabled={locked}
          onClick={() => onSelect(c.value)}
        >
          <InlineText text={c.label} />
        </ChoiceButton>
      ))}
    </div>
  );
}

function FillBlank({ question, onSelect, ...view }: ExerciseProps & { question: Extract<ChoiceQuestion, { type: 'fill_blank' }> }) {
  const [before, after = ''] = question.template.split('___');
  const shown = view.answered !== undefined ? question.correct : view.selected;
  const blankCls = [
    styles.blank,
    shown !== undefined && styles.filled,
    view.answered !== undefined && styles.revealed,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={styles.list}>
      <p className={styles.sentence}>
        {before}
        <span className={blankCls}>{shown !== undefined ? String(shown) : '   '}</span>
        {after}
      </p>
      <ChoiceList question={question} onSelect={onSelect} {...view} />
    </div>
  );
}

function IdentifyError({ question, onSelect, ...view }: ExerciseProps & { question: Extract<ChoiceQuestion, { type: 'identify_error' }> }) {
  const locked = view.answered !== undefined;
  return (
    <p className={styles.segments} role="group" aria-label="Trechos da frase">
      {question.segments.map((seg, i) => {
        const state = choiceState(question, i, view);
        return (
          <button
            key={i}
            type="button"
            data-choice
            className={`${styles.segment} ${styles[state]}`}
            aria-pressed={state === 'selected'}
            disabled={locked}
            onClick={() => onSelect(i)}
          >
            {seg}
            {state === 'correct' && <span className={styles.sr}> (trecho com erro)</span>}
            {state === 'wrong' && <span className={styles.sr}> (sua resposta)</span>}
          </button>
        );
      })}
    </p>
  );
}
