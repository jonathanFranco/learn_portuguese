import { useState, type FormEvent } from 'react';
import { Button } from '../components/Button';
import { actions, useApp } from '../store';
import common from './common.module.css';
import styles from './Welcome.module.css';

/**
 * Primeiro acesso neste aparelho. Com Firebase: entrar com Google (traz o progresso da conta)
 * ou seguir sem conta (só neste aparelho). Depois, uma pergunta só: o nome.
 */
export function Welcome() {
  const notice = useApp((s) => s.notice);
  const cloudEnabled = useApp((s) => s.cloudEnabled);
  const account = useApp((s) => s.account);
  const syncing = useApp((s) => s.syncing);
  const syncError = useApp((s) => s.syncError);
  /** Saiu da conta: já há progresso aqui, então "sem conta" segue com ele (não pede nome). */
  const returning = useApp((s) => s.chooseAccount);
  const [skipLogin, setSkipLogin] = useState(false);

  const errors = (
    <>
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {syncError && <p className={styles.notice} role="alert">Não conseguimos sincronizar: {syncError}</p>}
    </>
  );

  if (account && syncing) {
    return (
      <main className={common.page}>
        <div className={styles.form} role="status">
          <p className={styles.mark} aria-hidden>🌱</p>
          <h1>Buscando seu progresso…</h1>
          <p className={common.soft}>{account.email}</p>
        </div>
      </main>
    );
  }

  if (cloudEnabled && !account && !skipLogin) {
    return (
      <main className={common.page}>
        <div className={styles.form}>
          <p className={styles.mark} aria-hidden>🌱</p>
          {returning ? (
            <>
              <h1>Você saiu da conta.</h1>
              <p className={common.soft}>Entre de novo para sincronizar, ou siga com o progresso deste aparelho.</p>
            </>
          ) : (
            <>
              <h1>Um passo de cada vez.</h1>
              <p className={common.soft}>Português para concursos em missões de 5 a 10 minutos.</p>
            </>
          )}
          <GoogleButton />
          <Button variant="ghost" block onClick={() => (returning ? actions().continueWithoutAccount() : setSkipLogin(true))}>
            Continuar sem conta
          </Button>
          <p className={styles.hint}>
            {returning
              ? 'Sem conta, o que você fizer fica só neste aparelho. Ao entrar de novo, sincroniza.'
              : 'Sem conta, seu progresso fica só neste aparelho. Dá para entrar depois nas configurações.'}
          </p>
          {errors}
        </div>
      </main>
    );
  }

  return (
    <main className={common.page}>
      <NameForm key={account?.uid ?? 'local'} suggested={account?.name?.split(' ')[0] ?? ''} />
      <div className={styles.footer}>
        {account ? (
          <p className={styles.notice}>
            Conectado como {account.email}.{' '}
            <button type="button" className={styles.link} onClick={() => void actions().signOut()}>Trocar de conta</button>
          </p>
        ) : (
          cloudEnabled && (
            <button type="button" className={styles.link} onClick={() => setSkipLogin(false)}>Prefiro entrar com Google</button>
          )
        )}
        {errors}
      </div>
    </main>
  );
}

function NameForm({ suggested }: { suggested: string }) {
  const [name, setName] = useState(suggested);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    actions().createUser(name);
    actions().dismissNotice();
  };
  return (
    <form className={styles.form} onSubmit={submit}>
      <p className={styles.mark} aria-hidden>🌱</p>
      <h1>Um passo de cada vez.</h1>
      <p className={common.soft}>Português para concursos em missões de 5 a 10 minutos.</p>
      <label className={styles.label} htmlFor="name">Como podemos te chamar?</label>
      <input
        id="name"
        className={styles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="given-name"
        autoFocus
        maxLength={40}
      />
      <Button type="submit" size="lg" block disabled={!name.trim()}>Começar</Button>
    </form>
  );
}

function GoogleButton() {
  const [opening, setOpening] = useState(false);
  const signIn = async () => {
    setOpening(true);
    await actions().signIn();
    setOpening(false);
  };
  return (
    <Button size="lg" block className={styles.google} disabled={opening} onClick={() => void signIn()}>
      <svg aria-hidden width="20" height="20" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
      {opening ? 'Abrindo o Google…' : 'Entrar com Google'}
    </Button>
  );
}
