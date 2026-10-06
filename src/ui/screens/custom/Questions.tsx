import { Link, useNavigate } from 'react-router';
import type { Question } from '../../../domain/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { actions, useApp, useCatalog } from '../../store';
import common from '../common.module.css';
import styles from './Custom.module.css';

const TYPE_LABEL: Partial<Record<Question['type'], string>> = {
  multiple_choice: 'Múltipla escolha',
  true_false: 'Verdadeiro ou falso',
};
const DIFFICULTY_LABEL = ['', 'Fácil', 'Média', 'Difícil'];

/** Aba Questões: as questões que a pessoa trouxe de fora, por assunto, para editar ou praticar só elas. */
export function Questions() {
  const data = useApp((s) => s.data!);
  const catalog = useCatalog();
  const navigate = useNavigate();
  const active = data.activeSession;
  const groups = catalog.topics
    .map((topic) => ({ topic, questions: data.custom.questions.filter((q) => q.topicId === topic.id) }))
    .filter((g) => g.questions.length > 0);

  const practice = (topicId: string) => {
    actions().startMission(actions().customMission(topicId));
    navigate('/sessao');
  };
  const resume = () => {
    actions().resume();
    navigate('/sessao');
  };

  return (
    <main className={common.page}>
      <header className={common.header}>
        <h1>Minhas questões</h1>
        <p className={common.soft}>
          Questões que você trouxe de provas, apostilas ou outros sites. Elas entram nas missões do assunto, e aqui você
          pratica só elas.
        </p>
        <div className={common.row}>
          <Button onClick={() => navigate('/questoes/nova')}>+ Adicionar questão</Button>
        </div>
      </header>

      {active && groups.length > 0 && (
        <Card tone="accent" className={common.stack}>
          <p>Você tem uma missão em andamento. Termine ela para praticar suas questões.</p>
          <div className={common.row}>
            <Button variant="secondary" onClick={resume}>Continuar missão</Button>
          </div>
        </Card>
      )}

      {groups.length === 0 && (
        <Card className={common.stack}>
          <h2>Nenhuma questão ainda</h2>
          <p className={common.soft}>
            Achou uma questão boa (ou que você errou) em outro lugar? Cadastre aqui: múltipla escolha ou verdadeiro/falso,
            com gabarito e, se quiser, a explicação.
          </p>
        </Card>
      )}

      {groups.map(({ topic, questions }) => (
        <Card key={topic.id} as="section" className={common.stack} aria-labelledby={`q-${topic.id}`}>
          <div className={styles.groupHead}>
            <div>
              <h2 id={`q-${topic.id}`}>{topic.name}</h2>
              <p className={common.soft}>
                {questions.length} {questions.length === 1 ? 'questão' : 'questões'}
              </p>
            </div>
            <Button variant="secondary" disabled={!!active} onClick={() => practice(topic.id)}>Praticar</Button>
          </div>
          <ul className={styles.list}>
            {questions.map((q) => (
              <li key={q.id}>
                <Link className={styles.item} to={`/questoes/editar/${q.id}`} aria-label={`Editar questão: ${q.statement}`}>
                  <span className={styles.itemTitle}>{q.statement}</span>
                  <span className={styles.itemMeta}>
                    {[TYPE_LABEL[q.type], DIFFICULTY_LABEL[q.difficulty], q.source, 'Editar'].filter(Boolean).join(' · ')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div>
            <Link className={styles.link} to={`/questoes/nova?assunto=${topic.id}`}>+ Questão em {topic.name}</Link>
          </div>
        </Card>
      ))}
    </main>
  );
}
