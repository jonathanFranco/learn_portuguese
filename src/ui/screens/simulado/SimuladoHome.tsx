import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { SIMULADO_CONFIG, simuladoRemainingMs } from '../../../domain/simulado';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Segmented } from '../../components/Segmented';
import { actions, useApp } from '../../store';
import common from '../common.module.css';
import { clock } from './format';
import styles from './Simulado.module.css';

type Size = `${(typeof SIMULADO_CONFIG.sizes)[number]}`;
const SIZES = SIMULADO_CONFIG.sizes.map(
  (n) => [String(n) as Size, `${n} questões · ${n * SIMULADO_CONFIG.minutesPerQuestion} min`] as const,
);

/** Começar um simulado, continuar o que está aberto e ver os anteriores. */
export function SimuladoHome() {
  const data = useApp((s) => s.data!);
  const navigate = useNavigate();
  const [size, setSize] = useState<Size>('20');
  const [error, setError] = useState<string>();
  const sim = data.simulado;

  const start = () => {
    try {
      actions().startSimulado(Number(size));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return;
    }
    navigate('/simulado/prova');
  };

  return (
    <main className={common.page}>
      <header className={common.header}>
        <Link to="/trilha" className={common.soft}>← Trilha</Link>
        <h1>Simulado</h1>
        <p className={common.soft}>
          Questões de todos os assuntos, com tempo de prova e sem correção até o fim. Treina ritmo, chute consciente e
          resistência. Os erros entram na sua revisão.
        </p>
      </header>

      {sim ? (
        <Card tone="accent" className={common.stack}>
          <p className={common.eyebrow}>Em andamento</p>
          <h2>
            {Object.keys(sim.answers).length} de {sim.questionIds.length} respondidas
          </h2>
          <p className={common.soft}>
            Restam {clock(simuladoRemainingMs(data, Date.now()))}. O tempo continua correndo mesmo fora da prova.
          </p>
          <Button size="lg" block onClick={() => navigate('/simulado/prova')}>Continuar</Button>
        </Card>
      ) : (
        <Card className={common.stack}>
          <h2>Novo simulado</h2>
          <Segmented name="size" options={SIZES} value={size} onChange={setSize} />
          <p className={common.soft}>
            Dá para pular e voltar, trocar a resposta e deixar em branco. Quando o tempo acaba, a prova é entregue com o
            que estiver marcado.
          </p>
          {error && <p role="alert">{error}</p>}
          <Button size="lg" block onClick={start}>Começar simulado</Button>
        </Card>
      )}

      {data.simulados.length > 0 && (
        <section className={common.stack} aria-labelledby="historico">
          <h2 id="historico">Anteriores</h2>
          <ul className={styles.list}>
            {[...data.simulados].reverse().map((r) => (
              <li key={r.id}>
                <Card as="div" className={styles.history}>
                  <div>
                    <strong>
                      {r.correct} de {r.questionIds.length} ({Math.round((r.correct / Math.max(1, r.questionIds.length)) * 100)}%)
                    </strong>
                    <p className={common.soft}>{new Date(r.finishedAt).toLocaleDateString('pt-BR')} · {clock(r.elapsedMs)}</p>
                  </div>
                  <Link to={`/simulado/resultado/${encodeURIComponent(r.id)}`}>Ver correção</Link>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
