import { useEffect, useRef, useState, type RefObject } from 'react';
import { sessionAnswer } from '../../../app/selectors';
import { answerLabel, correctAnswerLabel, explainMistake } from '../../../domain/answer';
import { currentResult } from '../../../domain/study';
import type { Answer, Catalog, MissionStep, Question, StudySession } from '../../../domain/types';
import { Button } from '../../components/Button';
import { ExampleView } from '../../components/ExampleView';
import { InlineText, RichText } from '../../components/RichText';
import { XpBurst } from '../../components/XpBurst';
import { QuestionCard } from '../../exercises/QuestionCard';
import { actions, useApp, useCatalog } from '../../store';
import { next } from './next';
import { StepActions } from './StepActions';
import styles from './Session.module.css';

type QuestionLike = Extract<MissionStep, { kind: 'question' | 'mistake_review' }>;

function questionOf(catalog: Catalog, id: string): Question {
  const q = catalog.questionById.get(id);
  if (!q) throw new Error(`Questão desconhecida: ${id}`);
  return q;
}

function eyebrowOf(catalog: Catalog, step: QuestionLike, question: Question, missionTopicId: string): string {
  if (step.kind === 'mistake_review') return 'Revendo um erro seu';
  if (step.role === 'challenge') return 'Desafio';
  if (question.topicId !== missionTopicId) return `Relembrando · ${catalog.topicById.get(question.topicId)?.name ?? ''}`;
  return 'Questão';
}

/**
 * Questão do passo. Errou → 1. o que marcou × correta · 2. por quê · 3. outro exemplo (opcional)
 * · 4. tente uma parecida. Tudo dentro do mesmo passo; o estado vem da sessão (sobrevive a recarregar).
 */
export function QuestionStep({ session, step }: { session: StudySession; step: QuestionLike }) {
  const state = useApp((s) => s.data!);
  const catalog = useCatalog();
  const question = questionOf(catalog, step.questionId);
  const result = currentResult(session);
  const retryQuestion = result?.retry && questionOf(catalog, result.retry.questionId);
  const retryDone = result?.retry?.correct !== undefined;

  const answer = result && sessionAnswer(state, question.id, 'main', session.startedAt);
  const retryAnswer = retryDone && retryQuestion ? sessionAnswer(state, retryQuestion.id, 'retry', session.startedAt) : undefined;

  const [retrying, setRetrying] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const retryRef = useRef<HTMLDivElement>(null);
  useScrollIntoView(feedbackRef, result !== undefined);
  useScrollIntoView(retryRef, retrying);

  const example = showExample ? similarExample(catalog, question) : undefined;
  const showRetry = retryQuestion && (retrying || retryDone);
  const awaitingRetry = !!retryQuestion && !retryDone && !retrying;
  const done = result !== undefined && (!retryQuestion || retryDone);

  return (
    <>
      <section className={styles.step}>
        <p className={styles.eyebrow}>{eyebrowOf(catalog, step, question, session.mission.topicId)}</p>
        <QuestionCard question={question} answered={answer} onAnswer={(a) => actions().answer(a)} />

        {result && answer !== undefined && (
          <div ref={feedbackRef}>
            <Feedback question={question} answer={answer} correct={!!result.correct} xp={result.correct ? result.xp : 0} />
          </div>
        )}
        {example && <ExampleView example={example} />}

        {showRetry && (
          <div ref={retryRef} className={styles.retry}>
            <p className={styles.eyebrow}>Agora tente esta</p>
            <QuestionCard
              key={retryQuestion.id}
              question={retryQuestion}
              answered={retryAnswer}
              onAnswer={(a) => actions().answerRetry(a)}
            />
            {retryDone && retryAnswer !== undefined && (
              <Feedback question={retryQuestion} answer={retryAnswer} correct={!!result?.retry?.correct} xp={result?.retry?.correct ? result.xp : 0} retry />
            )}
          </div>
        )}
      </section>

      {awaitingRetry && (
        <StepActions onPrimary={() => setRetrying(true)}>
          {!showExample && similarExample(catalog, question) && (
            <Button variant="secondary" block onClick={() => setShowExample(true)}>
              Ver outro exemplo
            </Button>
          )}
          <Button size="lg" block onClick={() => setRetrying(true)}>
            Tentar uma parecida
          </Button>
        </StepActions>
      )}
      {done && (
        <StepActions onPrimary={next}>
          {!result.correct && !retryQuestion && !showExample && similarExample(catalog, question) && (
            <Button variant="secondary" block onClick={() => setShowExample(true)}>
              Ver outro exemplo
            </Button>
          )}
          <Button size="lg" block onClick={next}>
            Continuar
          </Button>
        </StepActions>
      )}
    </>
  );
}

interface FeedbackProps {
  question: Question;
  answer: Answer;
  correct: boolean;
  xp: number;
  retry?: boolean;
}

function Feedback({ question, answer, correct, xp, retry }: FeedbackProps) {
  // Questão da pessoa pode não ter explicação.
  const why = correct ? question.explanation : explainMistake(question, answer);
  const title = correct ? (retry ? 'Agora sim. Você recuperou!' : 'Isso mesmo!') : retry ? 'Tudo bem — o erro também ensina.' : 'Não foi dessa vez.';
  return (
    <div className={`${styles.feedback} ${correct ? styles.correct : styles.wrong}`} role="status">
      <div className={styles.feedbackHead}>
        <strong>
          <span aria-hidden>{correct ? '✓ ' : '• '}</span>
          {title}
        </strong>
        <XpBurst xp={xp} />
      </div>
      {!correct && (
        <dl className={styles.compare}>
          <dt>Você marcou</dt>
          <dd><InlineText text={answerLabel(question, answer)} /></dd>
          <dt>Correta</dt>
          <dd><InlineText text={correctAnswerLabel(question)} /></dd>
        </dl>
      )}
      {why.trim() && (
        <div>
          {!correct && <p className={styles.why}>Por quê?</p>}
          <RichText text={why} />
        </div>
      )}
    </div>
  );
}

/** Um exemplo da lição da mesma skill — o último, que costuma ser o "outro exemplo". */
function similarExample(catalog: Catalog, question: Question) {
  const lesson = catalog.lessons.find((l) => l.skillId === question.skillId);
  return lesson?.examples.at(-1);
}

function useScrollIntoView(ref: RefObject<HTMLElement | null>, when: boolean) {
  useEffect(() => {
    if (when) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [ref, when]);
}
