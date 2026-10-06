import { useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import type { Draft } from '../../../domain/custom';
import type { AlternativeId, Difficulty, Question } from '../../../domain/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Segmented } from '../../components/Segmented';
import { actions, useApp, useCatalog } from '../../store';
import common from '../common.module.css';
import styles from './Custom.module.css';
import { initialTopicSkill, TopicSkillFields } from './TopicSkillFields';

/** Tipos que a pessoa consegue cadastrar à mão (os que as provas mais usam). */
type Kind = 'multiple_choice' | 'true_false';

const KINDS = [
  ['multiple_choice', 'Múltipla escolha'],
  ['true_false', 'Verdadeiro ou falso'],
] as const;
const VERDICTS = [
  ['true', 'Verdadeiro (certo)'],
  ['false', 'Falso (errado)'],
] as const;
const DIFFICULTIES = [
  ['1', 'Fácil'],
  ['2', 'Média'],
  ['3', 'Difícil'],
] as const;
const LETTERS: AlternativeId[] = ['A', 'B', 'C', 'D', 'E'];

const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** Criar (`/questoes/nova`) ou editar (`/questoes/editar/:id`) uma questão da pessoa. */
export function QuestionEditor() {
  const { id } = useParams();
  const existing = useApp((s) => (id ? s.data?.custom.questions.find((q) => q.id === id) : undefined));
  if (id && !existing) return <Navigate to="/questoes" replace />;
  return <QuestionForm key={id ?? 'nova'} existing={existing} />;
}

function QuestionForm({ existing }: { existing?: Question }) {
  const catalog = useCatalog();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mc = existing?.type === 'multiple_choice' ? existing : undefined;
  const tf = existing?.type === 'true_false' ? existing : undefined;

  const [kind, setKind] = useState<Kind>(tf ? 'true_false' : 'multiple_choice');
  const [where, setWhere] = useState(() =>
    existing ? { topicId: existing.topicId, skillId: existing.skillId } : initialTopicSkill(catalog, params.get('assunto')),
  );
  const [passage, setPassage] = useState(existing?.passage ?? '');
  const [statement, setStatement] = useState(existing?.statement ?? '');
  const [alts, setAlts] = useState(() => mc?.alternatives.map((a) => a.text) ?? ['', '', '', '', '']);
  const [correct, setCorrect] = useState(() => (mc ? mc.alternatives.findIndex((a) => a.id === mc.correct) : -1));
  const [verdict, setVerdict] = useState<'true' | 'false' | ''>(tf ? String(tf.correct) as 'true' | 'false' : '');
  const [explanation, setExplanation] = useState(existing?.explanation ?? '');
  const [difficulty, setDifficulty] = useState<'1' | '2' | '3'>(String(existing?.difficulty ?? 2) as '1' | '2' | '3');
  const [source, setSource] = useState(existing?.source ?? '');
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const statementRef = useRef<HTMLTextAreaElement>(null);

  const ready =
    statement.trim() !== '' &&
    (kind === 'multiple_choice' ? alts.every((a) => a.trim() !== '') && correct >= 0 : verdict !== '');

  const draft = (): Draft<Question> => {
    const optional = (key: 'passage' | 'source', value: string) => (value.trim() ? { [key]: value.trim() } : {});
    const base = {
      id: existing?.id,
      ...where,
      difficulty: Number(difficulty) as Difficulty,
      statement: statement.trim(),
      explanation: explanation.trim(),
      ...optional('passage', passage),
      ...optional('source', source),
    };
    return kind === 'multiple_choice'
      ? {
          ...base,
          type: 'multiple_choice',
          alternatives: alts.map((text, i) => ({ id: LETTERS[i]!, text: text.trim() })),
          correct: LETTERS[correct]!,
        }
      : { ...base, type: 'true_false', correct: verdict === 'true' };
  };

  const save = (another: boolean) => {
    try {
      actions().saveQuestion(draft());
    } catch (e) {
      setError(`Não foi possível salvar: ${errorText(e)}`);
      return;
    }
    if (!another) return navigate('/questoes', { replace: true });
    // Mesmo assunto, tipo, texto de apoio e fonte: costuma ser a próxima questão da mesma prova.
    setStatement('');
    setAlts(alts.map(() => ''));
    setCorrect(-1);
    setVerdict('');
    setExplanation('');
    setError(undefined);
    setMessage('Questão salva. Pode cadastrar a próxima.');
    statementRef.current?.focus();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save(false);
  };

  const remove = () => {
    if (!existing || !window.confirm('Apagar esta questão?')) return;
    try {
      actions().deleteQuestion(existing.id);
    } catch (e) {
      setError(errorText(e));
      return;
    }
    navigate('/questoes', { replace: true });
  };

  const removeAlt = (i: number) => {
    setAlts(alts.filter((_, j) => j !== i));
    setCorrect(correct === i ? -1 : correct > i ? correct - 1 : correct);
  };

  return (
    <main className={common.page}>
      <header className={common.header}>
        <Link to="/questoes" className={styles.back}>← Questões</Link>
        <h1>{existing ? 'Editar questão' : 'Nova questão'}</h1>
        <p className={common.soft}>Copie de uma prova, apostila ou site. Ela entra nas missões do assunto.</p>
      </header>

      <Card>
        <form className={styles.form} onSubmit={submit}>
          <fieldset className={styles.field}>
            <legend>Tipo</legend>
            <Segmented name="kind" options={KINDS} value={kind} onChange={setKind} />
          </fieldset>

          <TopicSkillFields value={where} onChange={setWhere} />

          <div className={styles.field}>
            <label htmlFor="q-passage">
              Texto de apoio <span className={styles.optional}>(opcional)</span>
            </label>
            <textarea id="q-passage" className={styles.input} value={passage} maxLength={6000} onChange={(e) => setPassage(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label htmlFor="q-statement">Enunciado</label>
            <textarea
              id="q-statement"
              ref={statementRef}
              className={styles.input}
              value={statement}
              maxLength={2000}
              onChange={(e) => setStatement(e.target.value)}
            />
          </div>

          {kind === 'multiple_choice' ? (
            <fieldset className={styles.field}>
              <legend>
                Alternativas <span className={styles.optional}>— toque na letra da correta</span>
              </legend>
              <div className={styles.alts}>
                {alts.map((text, i) => (
                  <div key={i} className={styles.alt}>
                    <label className={styles.letter}>
                      <input
                        type="radio"
                        name="correct"
                        checked={correct === i}
                        onChange={() => setCorrect(i)}
                        aria-label={`${LETTERS[i]} é a correta`}
                      />
                      {LETTERS[i]}
                    </label>
                    <textarea
                      rows={2}
                      className={`${styles.input} ${styles.short}`}
                      value={text}
                      maxLength={1000}
                      aria-label={`Texto da alternativa ${LETTERS[i]}`}
                      onChange={(e) => setAlts(alts.map((a, j) => (j === i ? e.target.value : a)))}
                    />
                    {alts.length > 2 ? (
                      <Button variant="ghost" aria-label={`Remover alternativa ${LETTERS[i]}`} onClick={() => removeAlt(i)}>
                        ✕
                      </Button>
                    ) : (
                      <span />
                    )}
                  </div>
                ))}
              </div>
              {alts.length < LETTERS.length && (
                <div>
                  <Button variant="ghost" onClick={() => setAlts([...alts, ''])}>+ Alternativa</Button>
                </div>
              )}
            </fieldset>
          ) : (
            <fieldset className={styles.field}>
              <legend>Gabarito</legend>
              <Segmented name="verdict" options={VERDICTS} value={verdict} onChange={setVerdict} />
            </fieldset>
          )}

          <div className={styles.field}>
            <label htmlFor="q-explanation">
              Explicação <span className={styles.optional}>(opcional)</span>
            </label>
            <textarea
              id="q-explanation"
              className={styles.input}
              value={explanation}
              maxLength={3000}
              aria-describedby="q-explanation-hint"
              onChange={(e) => setExplanation(e.target.value)}
            />
            <p id="q-explanation-hint" className={styles.hint}>
              Aparece depois que você responde. Dá para usar **negrito**, _itálico_ e `destaque`.
            </p>
          </div>

          <div className={styles.pair}>
            <fieldset className={styles.field}>
              <legend>Dificuldade</legend>
              <Segmented name="difficulty" options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
            </fieldset>
            <div className={styles.field}>
              <label htmlFor="q-source">
                Fonte <span className={styles.optional}>(opcional)</span>
              </label>
              <input
                id="q-source"
                className={styles.input}
                value={source}
                maxLength={120}
                placeholder="Ex.: prova, ano, cargo"
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
          </div>

          {error && <p role="alert" className={styles.error}>{error}</p>}
          {message && <p role="status" className={common.soft}>{message}</p>}

          <div className={styles.actions}>
            <Button type="submit" disabled={!ready}>Salvar</Button>
            {!existing && (
              <Button variant="secondary" disabled={!ready} onClick={() => save(true)}>Salvar e cadastrar outra</Button>
            )}
          </div>

          {existing && (
            <div className={styles.danger}>
              <Button variant="ghost" onClick={remove}>Apagar questão</Button>
            </div>
          )}
        </form>
      </Card>
    </main>
  );
}
