import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { simuladoRemainingMs } from '../../../domain/simulado';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { Sheet } from '../../components/Sheet';
import { QuestionCard } from '../../exercises/QuestionCard';
import { useHotkeys } from '../../hooks/useHotkeys';
import { actions, appStore, useApp, useCatalog } from '../../store';
import session from '../session/Session.module.css';
import { clock } from './format';
import styles from './Simulado.module.css';

/** Abaixo disso o relógio fica vermelho. */
const LOW_TIME_MS = 5 * 60_000;

/** Modo prova: uma questão por vez, navegação livre, sem correção. Tempo esgotado = entrega. */
export function SimuladoExam() {
  const data = useApp((s) => s.data!);
  const sim = data.simulado;
  const catalog = useCatalog();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [now, setNow] = useState(Date.now);
  const mainRef = useRef<HTMLElement>(null);
  /** Entregue por esta tela: vai para o resultado, não volta para o início. */
  const delivered = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [index]);

  const remaining = simuladoRemainingMs(data, now);
  const finish = () => {
    // Pode ser chamado duas vezes (tempo esgotado + clique, efeito em dobro no StrictMode).
    if (!appStore.getState().data?.simulado) return;
    delivered.current = true;
    const result = actions().finishSimulado();
    navigate(`/simulado/resultado/${encodeURIComponent(result.id)}`, { replace: true });
  };
  // Tempo esgotado (inclusive ao voltar para o app depois do prazo): entrega o que houver.
  const expired = sim !== null && remaining === 0;
  useEffect(() => {
    if (expired) finish();
  });

  const ids = sim?.questionIds.filter((id) => catalog.questionById.has(id)) ?? [];
  const go = (i: number) => setIndex(Math.max(0, Math.min(ids.length - 1, i)));
  useHotkeys({ ArrowLeft: () => go(index - 1), ArrowRight: () => go(index + 1) }, !!sim && !confirming);

  if (!sim) return delivered.current ? null : <Navigate to="/simulado" replace />;
  if (expired) return null;
  const questionId = ids[index];
  const question = questionId ? catalog.questionById.get(questionId) : undefined;
  if (!question) return null;

  const answered = ids.filter((id) => sim.answers[id] !== undefined).length;
  const blank = ids.length - answered;
  const last = index === ids.length - 1;

  return (
    <div className={session.shell}>
      <header className={session.top}>
        <button
          type="button"
          className={session.icon}
          onClick={() => navigate('/simulado')}
          aria-label="Sair (as respostas ficam salvas, mas o tempo continua correndo)"
        >
          ✕
        </button>
        <ProgressBar value={answered / ids.length} label="Questões respondidas" size="sm" />
        <span className={`${styles.timer} ${remaining < LOW_TIME_MS ? styles.low : ''}`} role="timer" aria-label="Tempo restante">
          {clock(remaining)}
        </span>
        <span className={session.count} aria-label={`Questão ${index + 1} de ${ids.length}`}>
          {index + 1} / {ids.length}
        </span>
      </header>

      <main ref={mainRef} tabIndex={-1} className={session.body} key={question.id}>
        <section className={session.step}>
          <p className={session.eyebrow}>Questão {index + 1}</p>
          <QuestionCard
            exam
            question={question}
            answered={sim.answers[question.id]}
            onAnswer={(a) => actions().answerSimulado(question.id, a)}
          />
          {sim.answers[question.id] !== undefined && (
            <div>
              <Button variant="ghost" onClick={() => actions().answerSimulado(question.id, undefined)}>
                Deixar em branco
              </Button>
            </div>
          )}

          <details className={styles.overview}>
            <summary>
              Todas as questões ({answered} de {ids.length} respondidas)
            </summary>
            <div className={styles.grid}>
              {ids.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  className={[styles.cell, sim.answers[id] !== undefined && styles.done, i === index && styles.current]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={`Questão ${i + 1}${sim.answers[id] !== undefined ? ', respondida' : ', em branco'}`}
                  aria-current={i === index ? 'step' : undefined}
                  onClick={() => go(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </details>
        </section>

        <div className={session.actions}>
          <div className={styles.nav}>
            <Button variant="secondary" disabled={index === 0} onClick={() => go(index - 1)}>
              ← Anterior
            </Button>
            {last ? (
              <Button onClick={() => setConfirming(true)}>Entregar</Button>
            ) : (
              <Button variant="secondary" onClick={() => go(index + 1)}>
                Próxima →
              </Button>
            )}
          </div>
          {!last && (
            <Button variant="ghost" block onClick={() => setConfirming(true)}>
              Entregar agora
            </Button>
          )}
        </div>
      </main>

      <Sheet open={confirming} onClose={() => setConfirming(false)} title="Entregar simulado" placement="center">
        <h2>Entregar o simulado?</h2>
        <p className={session.soft}>
          {blank === 0
            ? 'Todas as questões estão respondidas.'
            : `${blank} ${blank === 1 ? 'questão está' : 'questões estão'} em branco e não ${blank === 1 ? 'conta' : 'contam'} ponto.`}{' '}
          Depois de entregar, não dá para mudar as respostas.
        </p>
        <Button size="lg" block onClick={finish}>Entregar</Button>
        <Button variant="ghost" block onClick={() => setConfirming(false)}>Voltar à prova</Button>
      </Sheet>
    </div>
  );
}
