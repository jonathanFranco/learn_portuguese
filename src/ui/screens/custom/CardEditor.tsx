import { useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import type { Flashcard } from '../../../domain/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { actions, useApp, useCatalog } from '../../store';
import common from '../common.module.css';
import styles from './Custom.module.css';
import { initialTopicSkill, TopicSkillFields } from './TopicSkillFields';

const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** Criar (`/cartoes/novo`) ou editar (`/cartoes/editar/:id`) um cartão da pessoa. */
export function CardEditor() {
  const { id } = useParams();
  const existing = useApp((s) => (id ? s.data?.custom.flashcards.find((c) => c.id === id) : undefined));
  if (id && !existing) return <Navigate to="/cartoes" replace />;
  return <CardForm key={id ?? 'novo'} existing={existing} />;
}

function CardForm({ existing }: { existing?: Flashcard }) {
  const catalog = useCatalog();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [where, setWhere] = useState(() =>
    existing ? { topicId: existing.topicId, skillId: existing.skillId } : initialTopicSkill(catalog, params.get('assunto')),
  );
  const [front, setFront] = useState(existing?.front ?? '');
  const [back, setBack] = useState(existing?.back ?? '');
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const frontRef = useRef<HTMLTextAreaElement>(null);
  const ready = front.trim() !== '' && back.trim() !== '';

  const save = (another: boolean) => {
    try {
      actions().saveFlashcard({ id: existing?.id, ...where, front: front.trim(), back: back.trim() });
    } catch (e) {
      setError(`Não foi possível salvar: ${errorText(e)}`);
      return;
    }
    if (!another) return navigate('/cartoes', { replace: true });
    setFront('');
    setBack('');
    setError(undefined);
    setMessage('Cartão salvo. Pode escrever o próximo.');
    frontRef.current?.focus();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save(false);
  };

  const remove = () => {
    if (!existing || !window.confirm('Apagar este cartão? O histórico de revisão dele também some.')) return;
    actions().deleteFlashcard(existing.id);
    navigate('/cartoes', { replace: true });
  };

  return (
    <main className={common.page}>
      <header className={common.header}>
        <Link to="/cartoes" className={styles.back}>← Cartões</Link>
        <h1>{existing ? 'Editar cartão' : 'Novo cartão'}</h1>
        <p className={common.soft}>Uma pergunta curta na frente; a resposta e o porquê no verso.</p>
      </header>

      <Card>
        <form className={styles.form} onSubmit={submit}>
          <TopicSkillFields value={where} onChange={setWhere} />

          <div className={styles.field}>
            <label htmlFor="card-front">Frente</label>
            <textarea
              id="card-front"
              ref={frontRef}
              className={styles.input}
              value={front}
              maxLength={500}
              placeholder="Ex.: Há crase antes de palavra masculina?"
              onChange={(e) => setFront(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="card-back">Verso</label>
            <textarea
              id="card-back"
              className={styles.input}
              value={back}
              maxLength={2000}
              placeholder="Ex.: Não. Crase = a + a, e palavra masculina não aceita o artigo “a”."
              aria-describedby="card-back-hint"
              onChange={(e) => setBack(e.target.value)}
            />
            <p id="card-back-hint" className={styles.hint}>Dá para usar **negrito**, _itálico_ e `destaque`.</p>
          </div>

          {error && <p role="alert" className={styles.error}>{error}</p>}
          {message && <p role="status" className={common.soft}>{message}</p>}

          <div className={styles.actions}>
            <Button type="submit" disabled={!ready}>Salvar</Button>
            {!existing && (
              <Button variant="secondary" disabled={!ready} onClick={() => save(true)}>Salvar e criar outro</Button>
            )}
          </div>

          {existing && (
            <div className={styles.danger}>
              <Button variant="ghost" onClick={remove}>Apagar cartão</Button>
            </div>
          )}
        </form>
      </Card>
    </main>
  );
}
