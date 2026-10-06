import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ACHIEVEMENTS } from '../../domain/achievements';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Confetti } from '../components/Confetti';
import { MasteryBar } from '../components/MasteryBar';
import { useCountUp } from '../hooks/useCountUp';
import { actions, appStore, useApp, useCatalog } from '../store';
import common from './common.module.css';
import styles from './MissionDone.module.css';

export function MissionDone() {
  // Fixado ao montar: "Mais uma missão" limpa o resumo na store, e a tela não deve reagir a isso.
  const [summary] = useState(() => appStore.getState().lastSummary);
  const progress = useApp((s) => (summary ? s.data?.progress[summary.mission.topicId] : undefined));
  const navigate = useNavigate();
  const catalog = useCatalog();
  const xp = useCountUp(summary?.xpEarned ?? 0);
  // Barra começa no domínio anterior e cresce até o novo.
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!summary) return <Navigate to="/" replace />;
  const topic = catalog.topicById.get(summary.mission.topicId);
  const unlocked = ACHIEVEMENTS.filter((a) => summary.unlocked.includes(a.id));
  const score = grown ? summary.masteryAfter : summary.masteryBefore;

  const another = () => {
    actions().startMission(actions().recommend().mission);
    navigate('/sessao');
  };

  return (
    <main className={common.page}>
      <header className={styles.hero}>
        <p className={styles.mark} aria-hidden>
          🌱
          <Confetti />
        </p>
        <h1>Missão concluída</h1>
        <p className={styles.xp} aria-label={`Mais ${summary.xpEarned} XP`}>+{xp} XP</p>
        <p className={common.soft}>
          Você praticou {topic?.name} por {summary.minutes} min
          {summary.questions > 0 && ` · ${summary.correct} de ${summary.questions} certas`}.
        </p>
      </header>

      {topic && progress && (
        <Card>
          <MasteryBar name={topic.name} mastery={{ score, level: progress.mastery.level }} />
        </Card>
      )}

      {unlocked.map((a) => (
        <Card key={a.id} tone="accent" className={styles.achievement}>
          <span className={styles.icon} aria-hidden>{a.icon}</span>
          <div>
            <p className={common.eyebrow}>Conquista</p>
            <strong>{a.title}</strong>
            <p className={common.soft}>{a.description}</p>
          </div>
        </Card>
      ))}

      <div className={common.stack}>
        <Button size="lg" block onClick={() => navigate('/')}>Encerrar por hoje</Button>
        <Button variant="ghost" block onClick={another}>Mais uma missão</Button>
      </div>
    </main>
  );
}
