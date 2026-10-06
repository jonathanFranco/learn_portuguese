import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { answerLabel, correctAnswerLabel, isCorrect } from '../../../domain/answer';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { InlineText, RichText } from '../../components/RichText';
import { useApp, useCatalog } from '../../store';
import common from '../common.module.css';
import { clock } from './format';
import styles from './Simulado.module.css';

/** Nota, desempenho por assunto e a correção questão a questão. */
export function SimuladoReport() {
  const { id = '' } = useParams();
  const result = useApp((s) => s.data?.simulados.find((r) => r.id === id));
  const catalog = useCatalog();
  const navigate = useNavigate();
  if (!result) return <Navigate to="/simulado" replace />;

  const questions = result.questionIds.flatMap((qid) => catalog.questionById.get(qid) ?? []);
  const total = result.questionIds.length;
  const blank = questions.filter((q) => result.answers[q.id] === undefined).length;
  const byTopic = new Map<string, { total: number; correct: number }>();
  for (const q of questions) {
    const t = byTopic.get(q.topicId) ?? { total: 0, correct: 0 };
    t.total++;
    const a = result.answers[q.id];
    if (a !== undefined && isCorrect(q, a)) t.correct++;
    byTopic.set(q.topicId, t);
  }
  // Pior desempenho primeiro: é por onde vale começar a revisar.
  const topics = [...byTopic].sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total);

  return (
    <main className={common.page}>
      <header className={common.header}>
        <Link to="/simulado" className={common.soft}>← Simulados</Link>
        <p className={common.eyebrow}>Resultado do simulado</p>
        <h1>
          <span className={styles.score}>{Math.round((result.correct / Math.max(1, total)) * 100)}%</span>
        </h1>
        <p className={common.soft}>
          {result.correct} de {total} certas{blank > 0 && ` · ${blank} em branco`} · {clock(result.elapsedMs)} de prova ·{' '}
          {new Date(result.finishedAt).toLocaleDateString('pt-BR')}
        </p>
        <div className={common.row}>
          <Button onClick={() => navigate('/simulado')}>Novo simulado</Button>
        </div>
      </header>

      <Card className={common.stack} aria-labelledby="por-assunto">
        <h2 id="por-assunto">Por assunto</h2>
        <ul className={styles.list}>
          {topics.map(([topicId, t]) => {
            const name = catalog.topicById.get(topicId)?.name ?? topicId;
            return (
              <li key={topicId} className={styles.row}>
                <div className={styles.rowHead}>
                  <strong>{name}</strong>
                  <span>{t.correct}/{t.total}</span>
                </div>
                <ProgressBar value={t.correct / t.total} label={`Acertos em ${name}`} size="sm" />
              </li>
            );
          })}
        </ul>
      </Card>

      <section className={common.stack} aria-labelledby="correcao">
        <h2 id="correcao">Correção</h2>
        <ol className={styles.list}>
          {questions.map((q, i) => {
            const answer = result.answers[q.id];
            const ok = answer !== undefined && isCorrect(q, answer);
            const status = answer === undefined ? 'blank' : ok ? 'ok' : 'ko';
            return (
              <li key={q.id}>
                <Card as="article" className={styles.item}>
                  <p className={`${styles.mark} ${styles[status]}`}>
                    {i + 1}. {status === 'ok' ? '✓ Certa' : status === 'ko' ? '✗ Errada' : '— Em branco'} ·{' '}
                    {catalog.topicById.get(q.topicId)?.name}
                  </p>
                  {q.passage && (
                    <details>
                      <summary>Texto de apoio</summary>
                      <RichText text={q.passage} />
                    </details>
                  )}
                  <RichText text={q.statement} />
                  <dl className={styles.compare}>
                    {answer !== undefined && (
                      <>
                        <dt>Você marcou</dt>
                        <dd><InlineText text={answerLabel(q, answer)} /></dd>
                      </>
                    )}
                    <dt>Correta</dt>
                    <dd><InlineText text={correctAnswerLabel(q)} /></dd>
                  </dl>
                  {q.explanation.trim() && (
                    <details open={status === 'ko'}>
                      <summary>Explicação</summary>
                      <RichText text={q.explanation} />
                    </details>
                  )}
                </Card>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
