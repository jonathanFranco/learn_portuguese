import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { ACHIEVEMENTS } from '../../../domain/achievements';
import { buildCardDeck, nextIntervalDays } from '../../../domain/flashcards';
import type { CardGrade } from '../../../domain/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { RichText } from '../../components/RichText';
import { useHotkeys } from '../../hooks/useHotkeys';
import { actions, appStore, useApp, useCatalog } from '../../store';
import common from '../common.module.css';
import session from '../session/Session.module.css';
import styles from './CardSession.module.css';

/** Um cartão errado volta no fim da fila até este número de vezes por sessão. */
const MAX_APPEARANCES = 3;

const GRADES: { grade: CardGrade; label: string; key: string; variant: 'secondary' | 'primary' }[] = [
  { grade: 'again', label: 'Errei', key: '1', variant: 'secondary' },
  { grade: 'good', label: 'Lembrei', key: '2', variant: 'primary' },
  { grade: 'easy', label: 'Fácil', key: '3', variant: 'secondary' },
];

function intervalLabel(days: number) {
  return days === 0 ? 'agora' : days === 1 ? '1 dia' : `${days} dias`;
}

/** Modo foco dos cartões. A fila vive só na tela; cada nota é gravada na hora. */
export function CardSession() {
  const [round, setRound] = useState(0);
  return <Deck key={round} onMore={() => setRound((r) => r + 1)} />;
}

function Deck({ onMore }: { onMore(): void }) {
  const [params] = useSearchParams();
  const topicId = params.get('assunto') ?? undefined;
  const navigate = useNavigate();
  const location = useLocation();
  const [startedAt] = useState(Date.now);
  const catalog = useCatalog();
  const [queue, setQueue] = useState(() => buildCardDeck(appStore.getState().data!, catalog, Date.now(), topicId));
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [remembered, setRemembered] = useState(0);
  const [unlocked, setUnlocked] = useState<string[]>();
  const cardState = useApp((s) => (queue[pos] ? s.data?.cards[queue[pos]] : undefined));
  const mainRef = useRef<HTMLElement>(null);

  const cardId = queue[pos];
  const card = cardId ? catalog.flashcardById.get(cardId) : undefined;
  const done = unlocked !== undefined;

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [pos]);

  const leave = () => (location.key === 'default' ? navigate('/cartoes') : navigate(-1));
  const exit = () => {
    if (!done) actions().finishCards({ startedAt, reviewed });
    leave();
  };

  const grade = (g: CardGrade) => {
    if (!cardId || !revealed) return;
    actions().gradeCard(cardId, g);
    const next = g === 'again' && queue.filter((id) => id === cardId).length < MAX_APPEARANCES ? [...queue, cardId] : queue;
    const count = reviewed + 1;
    setQueue(next);
    setReviewed(count);
    if (g !== 'again') setRemembered((n) => n + 1);
    setRevealed(false);
    if (pos + 1 >= next.length) setUnlocked(actions().finishCards({ startedAt, reviewed: count }));
    else setPos(pos + 1);
  };

  useHotkeys(
    {
      ' ': () => setRevealed(true),
      Enter: () => setRevealed(true),
      '1': () => grade('again'),
      '2': () => grade('good'),
      '3': () => grade('easy'),
    },
    !done && !!card,
  );

  if (queue.length === 0) {
    return (
      <main className={common.page}>
        <header className={common.header}>
          <h1>Nada para revisar agora ✓</h1>
          <p className={common.soft}>Todos os cartões estão em dia. Eles voltam na data certa.</p>
        </header>
        <Button size="lg" block onClick={leave}>Voltar</Button>
      </main>
    );
  }

  if (done) {
    const achievements = ACHIEVEMENTS.filter((a) => unlocked.includes(a.id));
    const more = buildCardDeck(appStore.getState().data!, catalog, Date.now(), topicId).length > 0;
    return (
      <main className={common.page}>
        <header className={`${common.header} ${styles.hero}`}>
          <p className={styles.mark} aria-hidden>🗂️</p>
          <h1>Cartões revisados</h1>
          <p className={common.soft}>
            {reviewed} {reviewed === 1 ? 'resposta' : 'respostas'} · {remembered} lembrados. Os que você errou voltam logo; os
            que lembrou, só daqui a alguns dias.
          </p>
        </header>
        {achievements.map((a) => (
          <Card key={a.id} tone="accent">
            <p className={common.eyebrow}>Conquista</p>
            <strong>{a.icon} {a.title}</strong>
            <p className={common.soft}>{a.description}</p>
          </Card>
        ))}
        <div className={common.stack}>
          <Button size="lg" block onClick={leave}>Encerrar</Button>
          {more && <Button variant="ghost" block onClick={onMore}>Mais cartões</Button>}
        </div>
      </main>
    );
  }

  if (!card) return null;
  const topic = catalog.topicById.get(card.topicId);
  const skill = topic?.skills.find((s) => s.id === card.skillId);

  return (
    <div className={session.shell}>
      <header className={session.top}>
        <button type="button" className={session.icon} onClick={exit} aria-label="Sair (as respostas ficam salvas)">
          ✕
        </button>
        <ProgressBar value={pos / queue.length} label="Progresso dos cartões" size="sm" />
        <span className={session.count} aria-label={`Cartão ${pos + 1} de ${queue.length}`}>
          {pos + 1} / {queue.length}
        </span>
        <span />
      </header>

      <main ref={mainRef} tabIndex={-1} className={session.body} key={`${pos}`}>
        <article className={session.step}>
          <p className={session.eyebrow}>{topic?.name} · {skill?.name}</p>
          <div className={`${styles.card} ${revealed ? styles.flipped : ''}`}>
            <RichText className={styles.front} text={card.front} />
            {revealed && (
              <div className={styles.back} aria-live="polite">
                <RichText text={card.back} />
              </div>
            )}
          </div>
          {!revealed && <p className={styles.hint}>Responda de cabeça antes de virar.</p>}
        </article>

        <div className={session.actions}>
          {revealed ? (
            <div className={styles.grades} role="group" aria-label="Como foi?">
              {GRADES.map((g) => (
                <Button key={g.grade} variant={g.variant} size="lg" onClick={() => grade(g.grade)} aria-keyshortcuts={g.key}>
                  <span className={styles.gradeLabel}>
                    {g.label}
                    <small>{intervalLabel(nextIntervalDays(cardState, g.grade))}</small>
                  </span>
                </Button>
              ))}
            </div>
          ) : (
            <Button size="lg" block autoFocus onClick={() => setRevealed(true)}>Mostrar resposta</Button>
          )}
        </div>
      </main>
    </div>
  );
}
