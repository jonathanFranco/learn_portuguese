import { createStore } from 'zustand/vanilla';
import { extendCatalog, flashcardErrors, questionErrors } from '../content/catalog';
import {
  deleteCustomFlashcard,
  deleteCustomQuestion,
  saveCustomFlashcard,
  saveCustomQuestion,
  type Draft,
} from '../domain/custom';
import { completeCardSession, gradeCard } from '../domain/flashcards';
import { buildCustomMission } from '../domain/mission';
import { missionForTopic, recommendNextActivity } from '../domain/recommendation';
import { answerSimulado, finishSimulado, startSimulado } from '../domain/simulado';
import {
  advanceStep,
  answerRetry,
  answerStep,
  completeMission,
  createInitialState,
  discardSession,
  isSessionFinished,
  pauseSession,
  resumeSession,
  startSession,
  type AnswerOutcome,
  type MissionSummary,
} from '../domain/study';
import type {
  Answer,
  CardGrade,
  Catalog,
  CustomContent,
  Flashcard,
  Mission,
  Question,
  SimuladoResult,
  UserState,
} from '../domain/types';
import { importState, type Repository, type SyncMeta } from '../persistence/repository';
import { planSync, type Account, type Cloud } from './sync';

/** Resumo de um lado do conflito, para a pessoa escolher. */
export interface CopySummary {
  totalXp: number;
  missionsCompleted: number;
  savedAt: number;
}

export interface AppState {
  status: 'loading' | 'ready';
  /** null = primeiro acesso (pede o nome). */
  data: UserState | null;
  /** Aviso discreto quando o dado salvo estava ilegível e foi para backup. */
  notice?: string;
  saveError?: string;
  /** Resumo da última missão concluída (tela de conclusão). */
  lastSummary?: MissionSummary;
  /** Firebase configurado neste build. */
  cloudEnabled: boolean;
  account: Account | null;
  /** Saiu da conta com progresso neste aparelho: mostra a tela de entrada até escolher. */
  chooseAccount: boolean;
  /** Os dois lados mudaram desde a última sincronização: espera `resolveConflict`. */
  conflict?: { local: CopySummary; remote: CopySummary };
  /** Conferindo a nuvem (ex.: logo após entrar, antes de saber se há progresso). */
  syncing: boolean;
  syncError?: string;
}

export interface AppActions {
  init(): Promise<void>;
  /** Conteúdo do app + o criado pela pessoa. Mesma referência enquanto nada muda. */
  catalog(): Catalog;
  createUser(name: string): void;
  rename(name: string): void;
  startMission(mission: Mission): void;
  /** Missão recomendada agora. */
  recommend(): ReturnType<typeof recommendNextActivity>;
  missionFor(topicId: string): Mission;
  /** Missão só com as questões que a pessoa adicionou ao assunto. */
  customMission(topicId: string): Mission;
  answer(answer: Answer): AnswerOutcome;
  answerRetry(answer: Answer): AnswerOutcome;
  /** Avança; ao passar do último passo, conclui a missão. */
  next(): MissionSummary | undefined;
  pause(): void;
  resume(): void;
  discardSession(): void;
  gradeCard(cardId: string, grade: CardGrade): void;
  /** Fecha a sessão de cartões; retorna as conquistas desbloqueadas. */
  finishCards(session: { startedAt: number; reviewed: number }): string[];
  /** Cria ou edita um cartão da pessoa. Lança erro se for inválido. */
  saveFlashcard(card: Draft<Flashcard>): Flashcard;
  deleteFlashcard(id: string): void;
  /** Cria ou edita uma questão da pessoa. Lança erro se for inválida. */
  saveQuestion(question: Draft<Question>): Question;
  /** Lança erro se a questão estiver na missão ou no simulado em andamento. */
  deleteQuestion(id: string): void;
  startSimulado(size: number): void;
  /** `undefined` deixa a questão em branco. */
  answerSimulado(questionId: string, answer: Answer | undefined): void;
  finishSimulado(): SimuladoResult;
  importData(json: string): void;
  reset(): Promise<void>;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  /** Na tela de entrada após sair: segue com o progresso deste aparelho, sem sincronizar. */
  continueWithoutAccount(): void;
  /** Confere a nuvem (ao entrar, ao abrir e ao voltar para o app). */
  sync(): Promise<void>;
  /** Fica com um lado; o outro vira cópia de segurança local. */
  resolveConflict(keep: 'local' | 'remote'): Promise<void>;
  dismissNotice(): void;
}

export type AppStore = ReturnType<typeof createAppStore>;

export function createAppStore(
  repository: Repository,
  content: Catalog,
  now: () => number = Date.now,
  cloud: Cloud | null = null,
) {
  return createStore<AppState & AppActions>()((set, get) => {
    const data = (): UserState => {
      const d = get().data;
      if (!d) throw new Error('Usuário não criado.');
      return d;
    };

    let extended: { custom?: CustomContent; catalog: Catalog } = { catalog: content };
    const catalog = (): Catalog => {
      const custom = get().data?.custom;
      if (custom !== extended.custom) extended = { custom, catalog: custom ? extendCatalog(content, custom) : content };
      return extended.catalog;
    };

    const newId = (prefix: string) => `${prefix}-${now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

    let meta: SyncMeta = { savedAt: 0 };
    /** Conta cuja nuvem já foi conferida: só então gravamos nela. */
    let linked: Account | null = null;
    let pendingRemote: { state: UserState; savedAt: number } | undefined;
    let syncing: Promise<void> | undefined;

    const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));

    const persist = (state: UserState) =>
      repository.save(state, meta).then(
        () => get().saveError && set({ saveError: undefined }),
        (e: unknown) => set({ saveError: errorText(e) }),
      );

    const push = () => {
      const account = linked;
      const state = get().data;
      if (!cloud || !account || !state) return;
      const at = meta.savedAt;
      cloud.save(account.uid, { json: JSON.stringify(state), savedAt: at }).then(
        () => {
          if (linked?.uid !== account.uid || (meta.synced?.uid === account.uid && meta.synced.at >= at)) return;
          meta = { ...meta, synced: { uid: account.uid, at } };
          set({ syncError: undefined });
          void persist(get().data ?? state);
        },
        (e: unknown) => set({ syncError: errorText(e) }),
      );
    };

    /** Toda mudança de dados passa por aqui: atualiza a store, grava e envia. */
    const commit = (next: UserState, extra: Partial<AppState> = {}) => {
      set({ data: next, ...extra });
      meta = { ...meta, savedAt: Math.max(now(), meta.savedAt + 1) };
      void persist(next);
      push();
    };

    /** Troca o estado local pela cópia da nuvem. */
    const adopt = (account: Account, state: UserState, savedAt: number) => {
      meta = { savedAt, synced: { uid: account.uid, at: savedAt } };
      linked = account;
      const resumed = resumeSession(state, now());
      set({ data: resumed, lastSummary: undefined });
      void persist(resumed);
    };

    const summary = (s: UserState, savedAt: number): CopySummary => ({
      totalXp: s.user.totalXp,
      missionsCompleted: s.user.missionsCompleted,
      savedAt,
    });

    return {
      status: 'loading',
      data: null,
      cloudEnabled: cloud !== null,
      account: null,
      chooseAccount: false,
      syncing: false,

      async init() {
        const result = await repository.load();
        if (result.status === 'ok') {
          meta = result.meta;
          // Reabrir o app conta como retomar: o relógio do passo recomeça.
          set({ status: 'ready', data: resumeSession(result.state, now()) });
        } else if (result.status === 'recovered') {
          set({
            status: 'ready',
            data: null,
            notice: `Não conseguimos ler seus dados salvos. Uma cópia foi guardada (${result.backupKey}).`,
          });
        } else {
          set({ status: 'ready', data: null });
        }
        cloud?.watch((account) => {
          if (account?.uid === get().account?.uid) return;
          linked = null;
          pendingRemote = undefined;
          // Já marca "conferindo" junto com a conta: a tela não pisca "sem progresso" antes da nuvem responder.
          set({
            account,
            conflict: undefined,
            syncError: undefined,
            syncing: account !== null,
            ...(account && { chooseAccount: false }),
          });
          void get().sync();
        });
      },

      catalog,

      createUser(name) {
        commit(createInitialState(name.trim(), now()));
      },

      rename(name) {
        const d = data();
        commit({ ...d, user: { ...d.user, name: name.trim() } });
      },

      recommend() {
        return recommendNextActivity(data(), catalog(), now());
      },

      missionFor(topicId) {
        return missionForTopic(topicId, data(), catalog(), now());
      },

      customMission(topicId) {
        return buildCustomMission(topicId, data(), catalog());
      },

      startMission(mission) {
        commit(startSession(data(), mission, now()), { lastSummary: undefined });
      },

      answer(answer) {
        const outcome = answerStep(data(), catalog(), answer, now());
        commit(outcome.state);
        return outcome;
      },

      answerRetry(answer) {
        const outcome = answerRetry(data(), catalog(), answer, now());
        commit(outcome.state);
        return outcome;
      },

      next() {
        const advanced = advanceStep(data(), now());
        if (advanced.activeSession && isSessionFinished(advanced.activeSession)) {
          const { state, summary } = completeMission(advanced, catalog(), now());
          commit(state, { lastSummary: summary });
          return summary;
        }
        commit(advanced);
        return undefined;
      },

      pause() {
        commit(pauseSession(data(), now()));
      },

      resume() {
        commit(resumeSession(data(), now()));
      },

      discardSession() {
        commit(discardSession(data()));
      },

      gradeCard(cardId, grade) {
        commit(gradeCard(data(), cardId, grade, now()));
      },

      finishCards(session) {
        const { state, unlocked } = completeCardSession(data(), session, now());
        if (state !== data()) commit(state);
        return unlocked;
      },

      saveFlashcard(draft) {
        const card: Flashcard = { ...draft, id: draft.id ?? newId('meu-cartao') };
        const [error] = flashcardErrors(card, content);
        if (error) throw new Error(error);
        commit(saveCustomFlashcard(data(), card));
        return card;
      },

      deleteFlashcard(id) {
        commit(deleteCustomFlashcard(data(), id));
      },

      saveQuestion(draft) {
        const question: Question = { ...draft, id: draft.id ?? newId('minha-questao') };
        const [error] = questionErrors(question, content);
        if (error) throw new Error(error);
        commit(saveCustomQuestion(data(), question));
        return question;
      },

      deleteQuestion(id) {
        commit(deleteCustomQuestion(data(), id));
      },

      startSimulado(size) {
        commit(startSimulado(data(), catalog(), size, now()));
      },

      answerSimulado(questionId, answer) {
        commit(answerSimulado(data(), questionId, answer));
      },

      finishSimulado() {
        const { state, result } = finishSimulado(data(), catalog(), now());
        commit(state);
        return result;
      },

      importData(json) {
        commit(importState(json), { lastSummary: undefined });
      },

      async reset() {
        // Apagar é só deste aparelho: sai da conta antes, para o perfil novo não sobrescrever a nuvem.
        if (get().account) await get().signOut();
        await repository.clear();
        meta = { savedAt: 0 };
        set({ data: null, lastSummary: undefined, chooseAccount: false });
      },

      async signIn() {
        if (!cloud) return;
        try {
          await cloud.signIn();
        } catch (e) {
          set({ syncError: errorText(e) });
        }
      },

      async signOut() {
        if (!cloud) return;
        linked = null;
        await cloud.signOut();
        if (get().data) set({ chooseAccount: true });
      },

      continueWithoutAccount() {
        set({ chooseAccount: false });
      },

      sync() {
        const account = get().account;
        if (!cloud || !account || get().conflict) return Promise.resolve();
        syncing ??= (async () => {
          set({ syncing: true });
          try {
            const remote = await cloud.load(account.uid);
            if (get().account?.uid !== account.uid) return;
            const local = get().data;
            const plan = planSync({
              hasLocal: local !== null,
              savedAt: meta.savedAt,
              syncedAt: meta.synced?.uid === account.uid ? meta.synced.at : 0,
              remote,
            });
            // Cópia da nuvem é entrada externa: valida e migra antes de usar.
            const remoteState = remote && (plan === 'pull' || plan === 'conflict') ? importState(remote.json) : undefined;
            if (plan === 'pull') {
              adopt(account, remoteState!, remote!.savedAt);
            } else if (plan === 'conflict') {
              pendingRemote = { state: remoteState!, savedAt: remote!.savedAt };
              set({ conflict: { local: summary(local!, meta.savedAt), remote: summary(remoteState!, remote!.savedAt) } });
              return;
            } else {
              linked = account;
              if (plan === 'push') push();
              else if (remote && local && meta.synced?.at !== remote.savedAt) {
                // Mesma versão dos dois lados, só não estava marcada.
                meta = { ...meta, synced: { uid: account.uid, at: remote.savedAt } };
                void persist(local);
              }
            }
            set({ syncError: undefined });
          } catch (e) {
            set({ syncError: errorText(e) });
          } finally {
            syncing = undefined;
            set({ syncing: false });
          }
        })();
        return syncing;
      },

      async resolveConflict(keep) {
        const account = get().account;
        const remote = pendingRemote;
        const local = get().data;
        if (!account || !remote || !local) return;
        pendingRemote = undefined;
        if (keep === 'remote') {
          await repository.backup(local);
          adopt(account, remote.state, remote.savedAt);
        } else {
          await repository.backup(remote.state);
          linked = account;
          push();
        }
        set({ conflict: undefined });
      },

      dismissNotice() {
        set({ notice: undefined });
      },
    };
  });
}
