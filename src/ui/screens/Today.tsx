import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { daysSinceLastStudy, didMissionToday, headerStats } from '../../app/selectors';
import { cardStats } from '../../domain/flashcards';
import { recommendNextActivity } from '../../domain/recommendation';
import { DAY } from '../../domain/time';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Pill } from '../components/Pill';
import { actions, useApp, useCatalog } from '../store';
import styles from './common.module.css';

/** Sessão parada há mais que isso é oferecida como "continuar ou começar outra". */
const STALE_SESSION = 7 * DAY;

function greeting(now: number) {
  const h = new Date(now).getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

/** Hoje: uma decisão só — continuar ou começar a missão recomendada. */
export function Today() {
  const data = useApp((s) => s.data!);
  const catalog = useCatalog();
  const navigate = useNavigate();
  const now = Date.now();
  const recommendation = useMemo(() => recommendNextActivity(data, catalog, Date.now()), [data, catalog]);
  const stats = headerStats(data, now);
  const session = data.activeSession;
  const doneToday = didMissionToday(data, now);
  const away = daysSinceLastStudy(data, now);
  const dueCards = cardStats(data, catalog, now).due;

  const start = () => {
    actions().startMission(recommendation.mission);
    navigate('/sessao');
  };
  const resume = () => {
    actions().resume();
    navigate('/sessao');
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{greeting(now)}, {data.user.name}!</h1>
        <div className={styles.row}>
          {stats.streak > 0 && <Pill icon="🔥" label="Dias seguidos">{stats.streak} {stats.streak === 1 ? 'dia' : 'dias'}</Pill>}
          <Pill icon="⭐" label="XP">{stats.xp.toLocaleString('pt-BR')} XP</Pill>
        </div>
        {stats.streak === 0 && away !== undefined && away >= 2 && (
          <p className={styles.soft}>Seu último estudo foi há {away} dias. Que bom te ver de volta.</p>
        )}
      </header>

      {session ? (
        <Card tone="brand" className={styles.stack}>
          <p className={styles.eyebrow}>Continuar de onde parou</p>
          <h2>Você estava estudando {catalog.topicById.get(session.mission.topicId)?.name}</h2>
          <p className={styles.soft}>
            {remaining(session.mission.steps.length - session.stepIndex)}
          </p>
          <Button size="lg" block onClick={resume}>Continuar</Button>
          {now - session.updatedAt > STALE_SESSION && (
            <Button variant="ghost" block onClick={() => actions().discardSession()}>
              Começar outra missão
            </Button>
          )}
        </Card>
      ) : doneToday ? (
        <Card className={styles.stack}>
          <p className={styles.eyebrow}>Missão de hoje</p>
          <h2>Concluída ✓</h2>
          <p className={styles.soft}>Ótimo trabalho. O próximo passo fica para amanhã.</p>
          <Button variant="ghost" onClick={start}>Quer fazer mais uma?</Button>
        </Card>
      ) : (
        <Card tone="brand" className={styles.stack}>
          <p className={styles.eyebrow}>Missão de hoje</p>
          <h2>{recommendation.mission.title}</h2>
          <p className={styles.soft}>≈ {recommendation.estimatedMinutes} min · {recommendation.reason}</p>
          <Button size="lg" block onClick={start}>Começar</Button>
        </Card>
      )}

      {data.simulado && (
        <Card tone="accent" className={styles.stack}>
          <p className={styles.eyebrow}>Simulado em andamento</p>
          <h2>
            {Object.keys(data.simulado.answers).length} de {data.simulado.questionIds.length} respondidas
          </h2>
          <p className={styles.soft}>O tempo continua correndo.</p>
          <Button variant="secondary" onClick={() => navigate('/simulado/prova')}>Voltar ao simulado</Button>
        </Card>
      )}

      {dueCards > 0 && (
        <Card className={styles.stack}>
          <p className={styles.eyebrow}>Cartões</p>
          <h2>{dueCards} {dueCards === 1 ? 'cartão volta' : 'cartões voltam'} hoje</h2>
          <p className={styles.soft}>Revisar agora fixa as regras antes de esquecer.</p>
          <Button variant="secondary" onClick={() => navigate('/cartoes/estudo')}>Revisar cartões</Button>
        </Card>
      )}
    </main>
  );
}

function remaining(n: number) {
  return n === 1 ? 'Falta 1 atividade.' : `Faltam ${n} atividades.`;
}
