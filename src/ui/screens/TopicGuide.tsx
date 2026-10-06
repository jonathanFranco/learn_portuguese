import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { cardStats } from '../../domain/flashcards';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ExampleView } from '../components/ExampleView';
import { RichText } from '../components/RichText';
import { TipList } from '../components/TipList';
import { actions, useApp, useCatalog } from '../store';
import common from './common.module.css';
import styles from './TopicGuide.module.css';

/** Resumão do assunto: cada regra com exemplo e as dicas de prova. Leitura livre, sem bloqueio. */
export function TopicGuide() {
  const { topicId = '' } = useParams();
  const data = useApp((s) => s.data!);
  const catalog = useCatalog();
  const navigate = useNavigate();
  const topic = catalog.topicById.get(topicId);
  if (!topic?.available) return <Navigate to="/trilha" replace />;

  const lessons = catalog.lessonsByTopic.get(topic.id) ?? [];
  const stats = cardStats(data, catalog, Date.now(), topic.id);
  const pending = stats.due + stats.fresh;
  const study = () => {
    actions().startMission(actions().missionFor(topic.id));
    navigate('/sessao');
  };

  return (
    <main className={common.page}>
      <header className={common.header}>
        <Link to="/trilha" className={styles.back}>← Trilha</Link>
        <p className={common.eyebrow}>Resumo e dicas de prova</p>
        <h1>{topic.name}</h1>
        <p className={common.soft}>{topic.description}</p>
        <div className={common.row}>
          <Button onClick={() => navigate(`/cartoes/estudo?assunto=${topic.id}`)} disabled={pending === 0}>
            🗂️ {pending > 0 ? `Cartões (${pending})` : 'Cartões em dia'}
          </Button>
          {!data.activeSession && (
            <Button variant="secondary" onClick={study}>Fazer uma missão</Button>
          )}
        </div>
      </header>

      {lessons.map((lesson, i) => (
        <Card key={lesson.id} as="article" className={common.stack} aria-labelledby={`l-${lesson.id}`}>
          <p className={common.eyebrow}>Regra {i + 1} de {lessons.length}</p>
          <h2 id={`l-${lesson.id}`}>{lesson.title}</h2>
          <RichText className={styles.summary} text={lesson.summary} />
          {lesson.examples[0] && <ExampleView example={lesson.examples[0]} />}
          <TipList tips={lesson.tips} />
          {lesson.deepDive && (
            <details className={styles.more}>
              <summary>Saber mais</summary>
              <RichText text={lesson.deepDive} />
            </details>
          )}
        </Card>
      ))}
    </main>
  );
}
