import type { CopySummary } from '../../app/store';
import { Button } from '../components/Button';
import { Sheet } from '../components/Sheet';
import { actions, useApp } from '../store';
import common from './common.module.css';

const when = (at: number) =>
  new Date(at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

const describe = (c: CopySummary) =>
  `${c.totalXp} XP · ${c.missionsCompleted} ${c.missionsCompleted === 1 ? 'missão' : 'missões'} · salvo em ${when(c.savedAt)}`;

/** Progresso diferente aqui e na nuvem: a pessoa escolhe; o outro lado vira cópia local. */
export function SyncConflict() {
  const conflict = useApp((s) => s.conflict);
  return (
    // Fechar = não sincronizar agora: sai da conta, nada muda em nenhum dos lados.
    <Sheet open={!!conflict} onClose={() => void actions().signOut()} title="Qual progresso manter?" placement="center">
      <h2>Qual progresso manter?</h2>
      <p className={common.soft}>
        Este aparelho e sua conta têm progressos diferentes. O que você não escolher fica guardado como cópia neste aparelho.
      </p>
      {conflict && (
        <>
          <Button size="lg" block autoFocus onClick={() => void actions().resolveConflict('remote')}>
            Da conta
            <br />
            <small>{describe(conflict.remote)}</small>
          </Button>
          <Button variant="secondary" size="lg" block onClick={() => void actions().resolveConflict('local')}>
            Deste aparelho
            <br />
            <small>{describe(conflict.local)}</small>
          </Button>
          <Button variant="ghost" block onClick={() => void actions().signOut()}>
            Agora não (sair da conta)
          </Button>
        </>
      )}
    </Sheet>
  );
}
