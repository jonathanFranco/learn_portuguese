import { describe, expect, it } from 'vitest';
import { catalog, RIGHT, T0 } from '../domain/testing/fixtures';
import { createInitialState } from '../domain/study';
import type { Repository } from '../persistence/repository';
import type { UserState } from '../domain/types';
import { createAppStore } from './store';
import type { Account, Cloud, CloudCopy } from './sync';

function fakeCloud(remote: CloudCopy | null = null) {
  let listener: (a: Account | null) => void = () => {};
  const cloud: Cloud & { remote: CloudCopy | null; login(): Promise<void> } = {
    remote,
    watch(cb) { listener = cb; },
    async signIn() { listener({ uid: 'u1', email: 'ana@x.com', name: 'Ana' }); },
    async signOut() { listener(null); },
    async load() { return cloud.remote; },
    async save(_uid, copy) { cloud.remote = copy; },
    async login() { await cloud.signIn(); await flush(); },
  };
  return cloud;
}

const flush = () => new Promise((r) => setTimeout(r, 0));

function memoryRepo(initial?: UserState): Repository & { saved?: UserState } {
  const repo: Repository & { saved?: UserState } = {
    saved: initial,
    async load() { return repo.saved ? { status: 'ok', state: repo.saved, meta: { savedAt: T0 } } : { status: 'empty' }; },
    async save(s) { repo.saved = s; },
    async backup() { return 'passo:backup:1'; },
    async clear() { repo.saved = undefined; },
  };
  return repo;
}

describe('store', () => {
  it('conteúdo da pessoa: valida, entra no catálogo e o catálogo só muda quando ele muda', async () => {
    const store = createAppStore(memoryRepo(createInitialState('Ana', T0)), catalog, () => T0);
    await store.getState().init();
    const before = store.getState().catalog();
    expect(before).toBe(catalog);

    expect(() =>
      store.getState().saveFlashcard({ topicId: 'alpha', skillId: 'b1', front: 'f', back: 'v' }),
    ).toThrow(/inexistente/);
    const card = store.getState().saveFlashcard({ topicId: 'alpha', skillId: 'a1', front: 'f', back: 'v' });
    const q = store.getState().saveQuestion({
      topicId: 'beta', skillId: 'b1', difficulty: 1, type: 'true_false', statement: 'S', correct: false, explanation: '',
    });
    expect(card.id).not.toBe(q.id);

    const after = store.getState().catalog();
    expect(after.flashcardById.get(card.id)).toEqual(card);
    expect(after.questionById.get(q.id)).toEqual(q);
    store.getState().startMission(store.getState().customMission('beta'));
    expect(store.getState().catalog()).toBe(after);
    expect(() => store.getState().deleteQuestion(q.id)).toThrow(/andamento/);
  });

  it('cria usuário, inicia missão, responde e grava a cada ação', async () => {
    const repo = memoryRepo();
    let now = T0;
    const store = createAppStore(repo, catalog, () => now);
    await store.getState().init();
    expect(store.getState().data).toBeNull();

    store.getState().createUser('  Ana ');
    expect(store.getState().data!.user.name).toBe('Ana');

    const { mission } = store.getState().recommend();
    store.getState().startMission(mission);
    while (store.getState().data!.activeSession) {
      now += 20_000;
      const session = store.getState().data!.activeSession!;
      const step = session.mission.steps[session.stepIndex]!;
      if (step.kind === 'question' || step.kind === 'mistake_review') store.getState().answer(RIGHT);
      store.getState().next();
    }
    await Promise.resolve();
    expect(store.getState().lastSummary?.mission.id).toBe(mission.id);
    expect(repo.saved?.user.missionsCompleted).toBe(1);
  });

  it('retoma sessão salva ao iniciar', async () => {
    const base = createInitialState('Ana', T0);
    const s1 = createAppStore(memoryRepo(base), catalog, () => T0);
    await s1.getState().init();
    s1.getState().startMission(s1.getState().recommend().mission);
    const saved = s1.getState().data!;

    const s2 = createAppStore(memoryRepo(saved), catalog, () => T0 + 86_400_000);
    await s2.getState().init();
    expect(s2.getState().data!.activeSession?.id).toBe(saved.activeSession!.id);
    expect(s2.getState().data!.activeSession!.stepStartedAt).toBe(T0 + 86_400_000);
  });

  describe('sincronização', () => {
    it('sair da conta mantém o progresso local e pede para escolher como seguir', async () => {
      const cloud = fakeCloud();
      const store = createAppStore(memoryRepo(createInitialState('Ana', T0)), catalog, () => T0 + 1000, cloud);
      await store.getState().init();
      await cloud.login();
      await store.getState().signOut();
      expect(store.getState().chooseAccount).toBe(true);
      expect(store.getState().data!.user.name).toBe('Ana');

      await cloud.login();
      expect(store.getState().chooseAccount).toBe(false);
      await store.getState().signOut();
      store.getState().continueWithoutAccount();
      expect(store.getState().chooseAccount).toBe(false);
      expect(store.getState().data!.user.name).toBe('Ana');
    });

    const remoteCopy = (name: string, xp: number, savedAt: number): CloudCopy => {
      const st = createInitialState(name, T0);
      return { json: JSON.stringify({ ...st, user: { ...st.user, totalXp: xp } }), savedAt };
    };

    it('aparelho novo baixa da nuvem; mudanças seguintes sobem', async () => {
      const cloud = fakeCloud(remoteCopy('Ana', 50, T0));
      const repo = memoryRepo();
      const store = createAppStore(repo, catalog, () => T0 + 1000, cloud);
      await store.getState().init();
      await cloud.login();
      expect(store.getState().data!.user.totalXp).toBe(50);

      store.getState().rename('Ana Paula');
      await flush();
      expect(JSON.parse(cloud.remote!.json).user.name).toBe('Ana Paula');
    });

    it('progresso dos dois lados: pede escolha e não grava na nuvem antes', async () => {
      const cloud = fakeCloud(remoteCopy('Ana', 50, T0 + 5));
      const repo = memoryRepo(createInitialState('Bia', T0));
      let backedUp: UserState | undefined;
      repo.backup = async (st) => { backedUp = st; return 'k'; };
      const store = createAppStore(repo, catalog, () => T0 + 1000, cloud);
      await store.getState().init();
      await cloud.login();
      expect(store.getState().conflict?.remote.totalXp).toBe(50);

      store.getState().rename('Bia 2');
      await flush();
      expect(JSON.parse(cloud.remote!.json).user.name).toBe('Ana');

      await store.getState().resolveConflict('local');
      await flush();
      expect(backedUp!.user.name).toBe('Ana');
      expect(JSON.parse(cloud.remote!.json).user.name).toBe('Bia 2');
      expect(store.getState().conflict).toBeUndefined();
    });

    it('nuvem de versão mais nova não é sobrescrita', async () => {
      const cloud = fakeCloud({ json: JSON.stringify({ schemaVersion: 999 }), savedAt: T0 + 5 });
      const store = createAppStore(memoryRepo(createInitialState('Bia', T0)), catalog, () => T0 + 1000, cloud);
      await store.getState().init();
      await cloud.login();
      expect(store.getState().syncError).toMatch(/mais nova/);
      store.getState().rename('Bia 2');
      await flush();
      expect(cloud.remote!.json).toContain('999');
    });

    it('apagar progresso sai da conta e preserva a nuvem', async () => {
      const cloud = fakeCloud();
      const store = createAppStore(memoryRepo(createInitialState('Ana', T0)), catalog, () => T0 + 1000, cloud);
      await store.getState().init();
      await cloud.login();
      await flush();
      const before = cloud.remote!.json;
      await store.getState().reset();
      expect(store.getState().account).toBeNull();
      expect(store.getState().chooseAccount).toBe(false);
      store.getState().createUser('Outra');
      await flush();
      expect(cloud.remote!.json).toBe(before);
    });
  });
});
