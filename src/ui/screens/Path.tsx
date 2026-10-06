import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { nodeStatus, progressDetail, topicViews, type TopicView } from '../../app/selectors';
import { MASTERY_LEVEL_NAMES } from '../../domain/mastery';
import type { UserState } from '../../domain/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MasteryBar } from '../components/MasteryBar';
import { Sheet } from '../components/Sheet';
import { actions, useApp, useCatalog } from '../store';
import common from './common.module.css';
import styles from './Path.module.css';

/** Trilha: 6 fases, um nó por assunto. Tocar no nó abre o resumo e o atalho para estudar. */
export function Path() {
  const data = useApp((s) => s.data!);
  const catalog = useCatalog();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string>();
  const views = topicViews(data, catalog);
  const open = views.find((v) => v.topic.id === openId);

  return (
    <main className={common.page}>
      <header className={common.header}>
        <h1>Sua trilha</h1>
        <p className={common.soft}>Do básico ao domínio, um assunto de cada vez.</p>
      </header>

      {catalog.phases.map((phase) => {
        const nodes = views.filter((v) => v.topic.phase === phase.id);
        return (
          <section key={phase.id} className={styles.phase} aria-labelledby={`phase-${phase.id}`}>
            <h2 id={`phase-${phase.id}`} className={styles.phaseTitle}>
              <span className={common.eyebrow}>Fase {phase.id}</span>
              {phase.name}
            </h2>
            <ol className={styles.nodes}>
              {nodes.map((v, i) => (
                <li key={v.topic.id} className={i % 2 ? styles.right : undefined}>
                  <Node view={v} onOpen={() => setOpenId(v.topic.id)} />
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      <Card tone="brand" className={common.stack} aria-labelledby="simulado">
        <p className={common.eyebrow}>Fim da trilha</p>
        <h2 id="simulado">Simulado</h2>
        <p className={common.soft}>Prova com tempo, questões de todos os assuntos e correção só no fim.</p>
        <div className={common.row}>
          <Button onClick={() => navigate('/simulado')}>
            {data.simulado ? 'Continuar simulado' : 'Fazer um simulado'}
          </Button>
        </div>
      </Card>

      <Sheet open={!!open} onClose={() => setOpenId(undefined)} title={open?.topic.name ?? ''}>
        {open && <TopicSheet view={open} data={data} />}
      </Sheet>
    </main>
  );
}

function Node({ view, onOpen }: { view: TopicView; onOpen(): void }) {
  const status = nodeStatus(view);
  const level = view.progress?.mastery.level ?? 0;
  const score = view.progress?.mastery.score ?? 0;
  const caption =
    status === 'soon' ? 'Em breve' : status === 'new' ? 'Novo' : MASTERY_LEVEL_NAMES[level];

  return (
    <button
      type="button"
      className={`${styles.node} ${styles[status]}`}
      onClick={onOpen}
      disabled={status === 'soon'}
      aria-label={`${view.topic.name} — ${caption}${status === 'started' ? `, ${score}%` : ''}`}
    >
      <span className={styles.disc} style={{ '--p': `${score}%` } as CSSProperties} aria-hidden>
        <span className={styles.inner}>
          {status === 'soon' ? '…' : status === 'new' ? '▶' : level}
        </span>
      </span>
      <span className={styles.label}>
        <strong>{view.topic.name}</strong>
        <span>{caption}</span>
      </span>
    </button>
  );
}

function TopicSheet({ view, data }: { view: TopicView; data: UserState }) {
  const catalog = useCatalog();
  const navigate = useNavigate();
  const status = nodeStatus(view);
  const active = data.activeSession;
  const study = () => {
    actions().startMission(actions().missionFor(view.topic.id));
    navigate('/sessao');
  };
  const resume = () => {
    actions().resume();
    navigate('/sessao');
  };

  // Só orienta: base sugerida que ainda não foi estudada.
  const suggested = view.topic.prerequisites
    .filter((id) => (data.progress[id]?.attempts ?? 0) === 0)
    .map((id) => catalog.topicById.get(id)?.name)
    .join(' e ');

  const guide = (
    <Button variant="secondary" block onClick={() => navigate(`/assunto/${view.topic.id}`)}>
      Resumo, dicas e cartões
    </Button>
  );

  return (
    <>
      <h2>{view.topic.name}</h2>
      <p className={common.soft}>{view.topic.description}</p>
      {status === 'started' && view.progress && (
        <MasteryBar name="Domínio" mastery={view.progress.mastery} detail={progressDetail(view.progress)} />
      )}
      {suggested && status === 'new' && (
        <p className={styles.lock}>Dica: fica mais fácil se você já tiver visto {suggested}.</p>
      )}
      {active ? (
        <div className={common.stack}>
          <p className={common.soft}>Você tem uma missão em andamento.</p>
          <Button size="lg" block onClick={resume}>Continuar a missão</Button>
          <Button variant="ghost" block onClick={study}>Começar esta mesmo assim</Button>
          {guide}
        </div>
      ) : (
        <div className={common.stack}>
          <Button size="lg" block onClick={study}>Estudar este assunto</Button>
          {guide}
        </div>
      )}
    </>
  );
}
