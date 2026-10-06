import { useState } from 'react';
import type { Answer, Question } from '../../domain/types';
import { Button } from '../components/Button';
import { RichText } from '../components/RichText';
import { useHotkeys } from '../hooks/useHotkeys';
import { choicesOf, isChoiceQuestion } from './choices';
import { Exercise } from './Exercise';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  question: Question;
  /** Resposta já dada: trava a questão e mostra correta/errada. No modo prova, só a marcação atual. */
  answered?: Answer;
  onAnswer(answer: Answer): void;
  /** Modo prova (simulado): tocar já marca, dá para trocar, sem correção nem "Responder". */
  exam?: boolean;
}

/** Enunciado + área de resposta + "Responder". Teclado: 1–5 / A–E / V–F escolhem, Enter confirma. */
export function QuestionCard({ question, answered, onAnswer, exam }: QuestionCardProps) {
  const [draft, setDraft] = useState<Answer>();
  const locked = !exam && answered !== undefined;
  const selected = exam ? answered : draft;
  const select = exam ? onAnswer : setDraft;
  const choices = isChoiceQuestion(question) ? choicesOf(question) : [];

  const confirm = () => {
    if (!locked && !exam && draft !== undefined) onAnswer(draft);
  };
  const keys: Record<string, () => void> = { Enter: confirm };
  choices.forEach((c, i) => {
    keys[String(i + 1)] = () => select(c.value);
    if (c.badge) keys[c.badge] = () => select(c.value);
  });
  useHotkeys(keys, !locked);

  return (
    <div className={styles.card}>
      {question.passage && (
        <blockquote className={styles.passage}>
          <RichText text={question.passage} />
        </blockquote>
      )}
      <RichText className={styles.statement} text={question.statement} />
      {isChoiceQuestion(question) ? (
        <Exercise question={question} selected={selected} answered={exam ? undefined : answered} onSelect={select} />
      ) : (
        <p className={styles.unsupported}>Este tipo de questão chega em breve.</p>
      )}
      {question.source && <p className={styles.source}>{question.source}</p>}
      {!locked && !exam && (
        <div className={styles.actions}>
          <Button size="lg" block disabled={selected === undefined} onClick={confirm}>
            Responder
          </Button>
        </div>
      )}
    </div>
  );
}
