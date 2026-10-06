import { useNavigate } from 'react-router';
import { headerStats, overallProgress, progressDetail, topicViews, weakSpots } from '../../app/selectors';
import { ACHIEVEMENTS } from '../../domain/achievements';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MasteryBar } from '../components/MasteryBar';
import { ProgressBar } from '../components/ProgressBar';
import { actions, useApp, useCatalog } from '../store';
import common from './common.module.css';
import { Settings } from './Settings';
import styles from './ProgressScreen.module.css';

export function ProgressScreen() {
  const data = useApp((s) => s.data!);
  const catalog = useCatalog();
  const navigate = useNavigate();
  const now = Date.now();
  const stats = headerStats(data, now);
  const overall = overallProgress(data, catalog);
  const weak = weakSpots(data, catalog).filter((v) => v.progress!.mastery.level < 5);
  const started = topicViews(data, catalog).filter((v) => (v.progress?.attempts ?? 0) > 0);

  const study = (topicId: string) => {
    actions().startMission(actions().missionFor(topicId));
    navigate('/sessao');
  };

  return (
    <main className={common.page}>
      <header className={common.header}>
        <h1>Seu progresso</h1>
      </header>

      <Card className={common.stack}>
        <div className={styles.overall}>
          <span className={styles.big}>{overall}%</span>
          <span className={common.soft}>do conteúdo disponível dominado</span>
        </div>
        <ProgressBar value={overall / 100} label="Progresso geral" />
        <dl className={styles.stats}>
          <div><dt>Nível</dt><dd>{stats.level.level}</dd></div>
          <div><dt>XP</dt><dd>{stats.xp.toLocaleString('pt-BR')}</dd></div>
          <div><dt>Missões</dt><dd>{data.user.missionsCompleted}</dd></div>
          <div><dt>Melhor sequência</dt><dd>{stats.bestStreak} {stats.bestStreak === 1 ? 'dia' : 'dias'}</dd></div>
        </dl>
      </Card>

      {weak.length > 0 && (
        <section className={common.stack} aria-labelledby="weak">
          <h2 id="weak" className={styles.section}>Pontos de atenção</h2>
          {weak.map((v) => (
            <Card key={v.topic.id} className={common.stack}>
              <MasteryBar name={v.topic.name} mastery={v.progress!.mastery} detail={progressDetail(v.progress)} />
              <Button variant="secondary" onClick={() => study(v.topic.id)}>Reforçar {v.topic.name}</Button>
            </Card>
          ))}
        </section>
      )}

      <section className={common.stack} aria-labelledby="topics">
        <h2 id="topics" className={styles.section}>Seus assuntos</h2>
        {started.length === 0 ? (
          <p className={common.soft}>Conclua sua primeira missão para ver seu domínio por assunto.</p>
        ) : (
          <Card className={common.stack}>
            {started.map((v) => (
              <MasteryBar key={v.topic.id} name={v.topic.name} mastery={v.progress!.mastery} detail={progressDetail(v.progress)} />
            ))}
          </Card>
        )}
      </section>

      <section className={common.stack} aria-labelledby="achievements">
        <h2 id="achievements" className={styles.section}>Conquistas</h2>
        <ul className={styles.achievements}>
          {ACHIEVEMENTS.map((a) => {
            const at = data.achievements[a.id];
            return (
              <li key={a.id} className={at ? styles.unlocked : styles.lockedAch}>
                <span className={styles.achIcon} aria-hidden>{at ? a.icon : '○'}</span>
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.description}</p>
                  {at && <p className={styles.date}>{new Date(at).toLocaleDateString('pt-BR')}</p>}
                </div>
                {!at && <span className={styles.sr}>(ainda não conquistada)</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <Settings />
    </main>
  );
}
