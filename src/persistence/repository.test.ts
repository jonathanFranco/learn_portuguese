import { describe, expect, it } from 'vitest';
import { createInitialState } from '../domain/study';
import { T0 } from '../domain/testing/fixtures';
import { exportState, importState, LocalStorageRepository } from './repository';

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() { return this.map.size; }
  clear() { this.map.clear(); }
  getItem(k: string) { return this.map.get(k) ?? null; }
  key(i: number) { return [...this.map.keys()][i] ?? null; }
  removeItem(k: string) { this.map.delete(k); }
  setItem(k: string, v: string) { this.map.set(k, v); }
}

describe('LocalStorageRepository', () => {
  it('vazio → salva → carrega igual', async () => {
    const repo = new LocalStorageRepository(new MemoryStorage());
    expect(await repo.load()).toEqual({ status: 'empty' });
    const state = createInitialState('Ana', T0);
    const meta = { savedAt: T0, synced: { uid: 'u1', at: T0 } };
    await repo.save(state, meta);
    expect(await repo.load()).toEqual({ status: 'ok', state, meta });
  });

  it('backup guarda cópia legível com chave própria', async () => {
    const storage = new MemoryStorage();
    const repo = new LocalStorageRepository(storage);
    const state = createInitialState('Ana', T0);
    const [a, b] = [await repo.backup(state), await repo.backup(state)];
    expect(a).not.toBe(b);
    expect(importState(storage.getItem(a)!)).toEqual(state);
  });

  it('dado corrompido vai para backup, nunca é apagado', async () => {
    const storage = new MemoryStorage();
    storage.setItem('passo:state', '{"quebrado": tru');
    const result = await new LocalStorageRepository(storage).load();
    expect(result.status).toBe('recovered');
    if (result.status !== 'recovered') return;
    expect(storage.getItem(result.backupKey)).toBe('{"quebrado": tru');
    expect(storage.getItem('passo:state')).toBeNull();
  });

  it('rejeita versão futura e formato inválido', () => {
    expect(() => importState(JSON.stringify({ schemaVersion: 999 }))).toThrow(/mais nova/);
    expect(() => importState(JSON.stringify({ schemaVersion: 1, user: {} }))).toThrow(/formato/);
  });

  it('v1 (antes dos cartões) sobe para a versão atual sem perder dados', () => {
    const { cards: _, custom: _c, simulado: _a, simulados: _b, ...v1 } = { ...createInitialState('Ana', T0), schemaVersion: 1 };
    expect(importState(JSON.stringify(v1))).toEqual(createInitialState('Ana', T0));
  });

  it('v2 (antes do conteúdo da pessoa) ganha listas vazias', () => {
    const { custom: _, simulado: _a, simulados: _b, ...v2 } = { ...createInitialState('Ana', T0), schemaVersion: 2 };
    expect(importState(JSON.stringify(v2))).toEqual(createInitialState('Ana', T0));
  });

  it('v3 (antes dos simulados) ganha simulado vazio e histórico vazio', () => {
    const { simulado: _a, simulados: _b, ...v3 } = { ...createInitialState('Ana', T0), schemaVersion: 3 };
    expect(importState(JSON.stringify(v3))).toEqual(createInitialState('Ana', T0));
  });

  it('rejeita conteúdo da pessoa com formato inválido', () => {
    const bad = { ...createInitialState('Ana', T0), custom: { flashcards: {}, questions: [] } };
    expect(() => importState(JSON.stringify(bad))).toThrow(/formato/);
  });

  it('export/import ida e volta', () => {
    const state = createInitialState('Ana', T0);
    expect(importState(exportState(state))).toEqual(state);
  });
});
