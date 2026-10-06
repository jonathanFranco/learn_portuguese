import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { dayKey } from '../../domain/time';
import { exportState } from '../../persistence/repository';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Segmented } from '../components/Segmented';
import { actions, appStore, useApp } from '../store';
import { getThemePref, setThemePref, type ThemePref } from '../theme';
import common from './common.module.css';
import styles from './Settings.module.css';

const THEMES: [ThemePref, string][] = [
  ['auto', 'Automático'],
  ['light', 'Claro'],
  ['dark', 'Escuro'],
];

export function Settings() {
  const data = useApp((s) => s.data!);
  const saveError = useApp((s) => s.saveError);
  const cloudEnabled = useApp((s) => s.cloudEnabled);
  const account = useApp((s) => s.account);
  const syncError = useApp((s) => s.syncError);
  const [name, setName] = useState(data.user.name);
  const [message, setMessage] = useState<string>();
  const [theme, setTheme] = useState(getThemePref);
  const fileRef = useRef<HTMLInputElement>(null);

  const rename = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === data.user.name) return;
    actions().rename(name);
    setMessage('Nome atualizado.');
  };

  const download = () => {
    const blob = new Blob([exportState(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: `passo-backup-${dayKey(Date.now())}.json` });
    a.click();
    URL.revokeObjectURL(url);
  };

  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!window.confirm('Importar este arquivo substitui todo o seu progresso atual. Continuar?')) return;
    try {
      actions().importData(await file.text());
      setName(appStore.getState().data?.user.name ?? '');
      setMessage('Dados importados.');
    } catch (err) {
      setMessage(`Não foi possível importar: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const reset = () => {
    const msg = account
      ? 'Apagar o progresso deste aparelho? Você sai da conta e o progresso na nuvem continua guardado.'
      : 'Apagar todo o progresso deste aparelho? Isso não pode ser desfeito. Exporte antes se quiser guardar.';
    if (!window.confirm(msg)) return;
    void actions().reset();
  };

  return (
    <section className={common.stack} aria-labelledby="settings">
      <h2 id="settings" className={styles.section}>Configurações</h2>
      <Card className={common.stack}>
        <form className={styles.field} onSubmit={rename}>
          <label htmlFor="settings-name">Seu nome</label>
          <div className={styles.inline}>
            <input id="settings-name" className={styles.input} value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
            <Button type="submit" variant="secondary">Salvar</Button>
          </div>
        </form>

        <fieldset className={styles.field}>
          <legend>Tema</legend>
          <Segmented
            name="theme"
            options={THEMES}
            value={theme}
            onChange={(value) => {
              setTheme(value);
              setThemePref(value);
            }}
          />
        </fieldset>

        {cloudEnabled && (
          <div className={styles.field}>
            <span>Sincronizar</span>
            {account ? (
              <>
                <p className={common.soft}>Conectado como {account.email ?? 'conta Google'}. Seu progresso fica salvo na conta e aparece nos seus outros aparelhos.</p>
                <div className={common.row}>
                  <Button variant="secondary" onClick={() => void actions().signOut()}>Sair da conta</Button>
                </div>
              </>
            ) : (
              <>
                <p className={common.soft}>Entre com sua conta Google para salvar o progresso na nuvem e continuar em outro aparelho.</p>
                <div className={common.row}>
                  <Button variant="secondary" onClick={() => void actions().signIn()}>Entrar com Google</Button>
                </div>
              </>
            )}
            {syncError && <p role="alert" className={styles.error}>Não conseguimos sincronizar: {syncError}</p>}
          </div>
        )}

        <div className={styles.field}>
          <span>Backup</span>
          <p className={common.soft}>
            {account
              ? 'Além da nuvem, você pode exportar uma cópia em arquivo.'
              : 'Seus dados ficam só neste navegador. Exporte para guardar ou levar para outro aparelho.'}
          </p>
          <div className={common.row}>
            <Button variant="secondary" onClick={download}>Exportar dados</Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>Importar dados</Button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={upload} />
          </div>
        </div>

        {message && <p role="status" className={common.soft}>{message}</p>}
        {saveError && <p role="alert" className={styles.error}>Não conseguimos salvar: {saveError}</p>}

        <div className={styles.danger}>
          <Button variant="ghost" onClick={reset}>Apagar meu progresso</Button>
        </div>
      </Card>
    </section>
  );
}
