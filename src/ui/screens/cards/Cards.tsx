import { Link, useNavigate } from 'react-router';
import { buildCardDeck, cardStats } from '../../../domain/flashcards';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { useApp, useCatalog } from '../../store';
import common from '../common.module.css';
import custom from '../custom/Custom.module.css';
import styles from './Cards.module.css';

/** Aba Cartões: revisão do dia (todos os assuntos) + um baralho por assunto. */
export function Cards() {
  const data = useApp((s) => s.data!);
  const catalog = useCatalog();
  const navigate = useNavigate();
  const now = Date.now();
  const today = buildCardDeck(data, catalog, now).length;
  const all = cardStats(data, catalog, now);
  const topics = catalog.topics.filter((t) => t.available);

  return (
    <main className={common.page}>
      <header className={common.header}>
        <h1>Cartões</h1>
        <p className={common.soft}>
          Regras, pegadinhas e macetes em perguntas rápidas. Cada cartão volta no dia certo para não esquecer.
        </p>
      </header>

      <Card tone="brand" className={common.stack}>
        <p className={common.eyebrow}>Revisão de hoje</p>
        {today > 0 ? (
          <>
            <h2>{today} {today === 1 ? 'cartão' : 'cartões'}</h2>
            <p className={common.soft}>
              {[all.due > 0 && `${Math.min(all.due, today)} para revisar`, today > all.due && `${today - all.due} novos`]
                .filter(Boolean)
                .join(' · ')}
              . Novos seguem a ordem da trilha.
            </p>
            <Button size="lg" block onClick={() => navigate('/cartoes/estudo')}>Começar</Button>
          </>
        ) : (
          <>
            <h2>Tudo em dia ✓</h2>
            <p className={common.soft}>Os próximos cartões voltam amanhã. Quer adiantar? Escolha um assunto abaixo.</p>
          </>
        )}
      </Card>

      <section className={common.stack} aria-labelledby="decks">
        <h2 id="decks" className={styles.section}>Por assunto</h2>
        <ul className={styles.decks}>
          {topics.map((t) => {
            const s = cardStats(data, catalog, now, t.id);
            const pending = s.due + s.fresh;
            return (
              <li key={t.id}>
                <Card className={styles.deck}>
                  <div className={styles.deckHead}>
                    <strong>{t.name}</strong>
                    <span className={common.soft}>{s.learned}/{s.total} sabidos</span>
                  </div>
                  <ProgressBar value={s.total ? s.learned / s.total : 0} label={`Cartões sabidos de ${t.name}`} size="sm" />
                  <p className={styles.meta}>
                    {[s.due > 0 && `${s.due} para revisar`, s.fresh > 0 && `${s.fresh} novos`].filter(Boolean).join(' · ') ||
                      'Em dia'}
                  </p>
                  <div className={common.row}>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/cartoes/estudo?assunto=${t.id}`)}
                      disabled={pending === 0}
                    >
                      Estudar
                    </Button>
                    <Link className={styles.link} to={`/assunto/${t.id}`}>Resumo e dicas</Link>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={common.stack} aria-labelledby="mine">
        <div className={styles.sectionHead}>
          <h2 id="mine" className={styles.section}>Meus cartões</h2>
          <Button variant="secondary" onClick={() => navigate('/cartoes/novo')}>+ Novo cartão</Button>
        </div>
        {data.custom.flashcards.length === 0 ? (
          <p className={common.soft}>
            Crie cartões com o que você quer lembrar: uma regra que confunde, um erro que você cometeu numa prova. Eles
            entram na revisão do dia, antes dos novos do app.
          </p>
        ) : (
          <ul className={custom.list}>
            {data.custom.flashcards.map((c) => (
              <li key={c.id}>
                <Link className={custom.item} to={`/cartoes/editar/${c.id}`} aria-label={`Editar cartão: ${c.front}`}>
                  <span className={custom.itemTitle}>{c.front}</span>
                  <span className={custom.itemMeta}>{catalog.topicById.get(c.topicId)?.name ?? 'Assunto removido'} · Editar</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
