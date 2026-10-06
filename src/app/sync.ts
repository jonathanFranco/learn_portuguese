/** Conta logada (hoje: Google via Firebase). */
export interface Account {
  uid: string;
  email: string | null;
  /** Nome na conta Google (sugere o nome no primeiro acesso). */
  name: string | null;
}

/** Cópia do progresso guardada na nuvem. `json` é validado por quem lê. */
export interface CloudCopy {
  json: string;
  savedAt: number;
}

/** Porta da nuvem. A store não sabe que é Firebase. */
export interface Cloud {
  /** Avisa a conta atual (inclusive a restaurada ao abrir) e cada troca. */
  watch(onChange: (account: Account | null) => void): void;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  load(uid: string): Promise<CloudCopy | null>;
  save(uid: string, copy: CloudCopy): Promise<void>;
}

/**
 * Quando cada lado mudou, em relação à última sincronização deste aparelho:
 * - `savedAt`: última gravação local;
 * - `syncedAt`: `savedAt` da última cópia confirmada na nuvem para esta conta (0 = nunca).
 */
export interface SyncInput {
  hasLocal: boolean;
  savedAt: number;
  syncedAt: number;
  remote: { savedAt: number } | null;
}

export type SyncPlan = 'none' | 'push' | 'pull' | 'conflict';

/** Nunca sobrescreve sem saber: se os dois lados mudaram, é conflito (o usuário escolhe). */
export function planSync({ hasLocal, savedAt, syncedAt, remote }: SyncInput): SyncPlan {
  if (!remote) return hasLocal ? 'push' : 'none';
  if (!hasLocal) return 'pull';
  const localChanged = savedAt > syncedAt;
  const remoteChanged = remote.savedAt !== syncedAt;
  if (localChanged && remoteChanged) return remote.savedAt === savedAt ? 'none' : 'conflict';
  if (remoteChanged) return 'pull';
  return localChanged ? 'push' : 'none';
}
