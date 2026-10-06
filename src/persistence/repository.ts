import type { UserState } from '../domain/types';
import { migrate } from './migrations';

/** Troca de localStorage por API = outra implementação desta interface. */
export interface Repository {
  load(): Promise<LoadResult>;
  save(state: UserState, meta: SyncMeta): Promise<void>;
  /** Guarda uma cópia à parte (nunca apagada pelo app); retorna a chave. */
  backup(state: UserState): Promise<string>;
  clear(): Promise<void>;
}

/** Quando o estado local foi gravado e até onde ele já está na nuvem. */
export interface SyncMeta {
  savedAt: number;
  synced?: { uid: string; at: number };
}

export type LoadResult =
  | { status: 'empty' }
  | { status: 'ok'; state: UserState; meta: SyncMeta }
  /** Dado ilegível foi preservado em backup; app começa limpo. */
  | { status: 'recovered'; backupKey: string; error: string };

const KEY = 'passo:state';
const META_KEY = 'passo:meta';
const BACKUP_PREFIX = 'passo:backup:';

export class LocalStorageRepository implements Repository {
  constructor(private readonly storage: Storage = localStorage) {}

  async load(): Promise<LoadResult> {
    const raw = this.storage.getItem(KEY);
    if (raw === null) return { status: 'empty' };
    try {
      return { status: 'ok', state: migrate(JSON.parse(raw)), meta: this.loadMeta() };
    } catch (e) {
      const backupKey = this.backupRaw(raw);
      this.storage.removeItem(KEY);
      this.storage.removeItem(META_KEY);
      return { status: 'recovered', backupKey, error: e instanceof Error ? e.message : String(e) };
    }
  }

  async save(state: UserState, meta: SyncMeta): Promise<void> {
    this.storage.setItem(KEY, JSON.stringify(state));
    this.storage.setItem(META_KEY, JSON.stringify(meta));
  }

  async backup(state: UserState): Promise<string> {
    return this.backupRaw(JSON.stringify(state));
  }

  async clear(): Promise<void> {
    this.storage.removeItem(KEY);
    this.storage.removeItem(META_KEY);
  }

  private backupRaw(raw: string): string {
    let stamp = Date.now();
    while (this.storage.getItem(`${BACKUP_PREFIX}${stamp}`) !== null) stamp++;
    const backupKey = `${BACKUP_PREFIX}${stamp}`;
    this.storage.setItem(backupKey, raw);
    return backupKey;
  }

  /** Meta ausente (dado de antes da sincronização) ou ilegível: "gravado agora, nunca sincronizado". */
  private loadMeta(): SyncMeta {
    try {
      const meta: unknown = JSON.parse(this.storage.getItem(META_KEY) ?? 'null');
      if (meta && typeof meta === 'object' && typeof (meta as SyncMeta).savedAt === 'number') return meta as SyncMeta;
    } catch {
      // cai no padrão
    }
    return { savedAt: Date.now() };
  }
}

/** Export/import manual (backup, troca de aparelho). */
export function exportState(state: UserState): string {
  return JSON.stringify(state, null, 2);
}

export function importState(json: string): UserState {
  return migrate(JSON.parse(json));
}
