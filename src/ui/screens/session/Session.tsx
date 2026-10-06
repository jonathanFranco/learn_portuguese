import { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { currentStep } from '../../../domain/study';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { Sheet } from '../../components/Sheet';
import { actions, useApp } from '../../store';
import { LessonStep, ExampleStep } from './TheoryStep';
import { QuestionStep } from './QuestionStep';
import styles from './Session.module.css';

/** Modo foco: só o passo atual. Sair salva; a sessão continua ativa para retomar. */
export function Session() {
  const session = useApp((s) => s.data?.activeSession ?? null);
  const finished = useApp((s) => s.lastSummary !== undefined);
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);
  const stepIndex = session?.stepIndex;
  // Leitor de tela e teclado começam do topo do passo novo.
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [stepIndex]);

  if (!session) return <Navigate to={finished ? '/concluida' : '/'} replace />;
  const step = currentStep(session);
  if (!step) return <Navigate to="/" replace />;

  const total = session.mission.steps.length;
  const paused = session.pausedAt !== undefined;
  const exit = () => {
    actions().pause();
    navigate('/');
  };

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <button type="button" className={styles.icon} onClick={exit} aria-label="Sair (seu progresso fica salvo)">
          ✕
        </button>
        <ProgressBar value={session.stepIndex / total} label="Progresso da missão" size="sm" />
        <span className={styles.count} aria-label={`Passo ${session.stepIndex + 1} de ${total}`}>
          {session.stepIndex + 1} / {total}
        </span>
        <button type="button" className={styles.icon} onClick={() => actions().pause()} aria-label="Pausar">
          ⏸
        </button>
      </header>

      <main ref={mainRef} tabIndex={-1} className={styles.body} key={`${session.id}:${session.stepIndex}`}>
        {step.kind === 'lesson' && <LessonStep lessonId={step.lessonId} />}
        {step.kind === 'example' && <ExampleStep lessonId={step.lessonId} exampleIndex={step.exampleIndex} />}
        {(step.kind === 'question' || step.kind === 'mistake_review') && (
          <QuestionStep session={session} step={step} />
        )}
      </main>

      <Sheet open={paused} onClose={() => actions().resume()} title="Pausado" placement="center">
        <h2>Pausado</h2>
        <p className={styles.soft}>Seu progresso está salvo. Volte quando quiser.</p>
        <Button size="lg" block autoFocus onClick={() => actions().resume()}>
          Continuar
        </Button>
        <Button variant="ghost" block onClick={() => navigate('/')}>
          Sair por agora
        </Button>
      </Sheet>
    </div>
  );
}
