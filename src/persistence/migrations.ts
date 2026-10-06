import { SCHEMA_VERSION } from '../domain/study';
import type { UserState } from '../domain/types';

/** migrations[n] transforma um estado da versão n na versão n+1. */
const migrations: Record<number, (s: Record<string, unknown>) => Record<string, unknown>> = {
  // v2: flashcards.
  1: (s) => ({ ...s, cards: {} }),
  // v3: cartões e questões criados pela pessoa.
  2: (s) => ({ ...s, custom: { flashcards: [], questions: [] } }),
  // v4: simulados.
  3: (s) => ({ ...s, simulado: null, simulados: [] }),
};

/** Sobe o estado salvo até a versão atual. Lança erro se for irreconhecível. */
export function migrate(raw: unknown): UserState {
  if (!isRecord(raw) || typeof raw.schemaVersion !== 'number') {
    throw new Error('Estado salvo sem schemaVersion.');
  }
  let state = raw;
  let version = raw.schemaVersion as number;
  if (version > SCHEMA_VERSION) {
    throw new Error(`Estado salvo é de uma versão mais nova (${version}).`);
  }
  while (version < SCHEMA_VERSION) {
    const step = migrations[version];
    if (!step) throw new Error(`Sem migração a partir da versão ${version}.`);
    state = { ...step(state), schemaVersion: version + 1 };
    version++;
  }
  assertShape(state);
  return state;
}

function assertShape(s: Record<string, unknown>): asserts s is Record<string, unknown> & UserState {
  const user = s.user;
  const ok =
    isRecord(user) &&
    typeof user.name === 'string' &&
    typeof user.totalXp === 'number' &&
    isRecord(s.progress) &&
    Array.isArray(s.attempts) &&
    isRecord(s.mistakes) &&
    (s.activeSession === null || isRecord(s.activeSession)) &&
    Array.isArray(s.recentQuestionIds) &&
    isRecord(s.achievements) &&
    isRecord(s.cards) &&
    isRecord(s.custom) &&
    Array.isArray(s.custom.flashcards) &&
    Array.isArray(s.custom.questions) &&
    (s.simulado === null || isRecord(s.simulado)) &&
    Array.isArray(s.simulados) &&
    isRecord(s.streak) &&
    isRecord(s.dailyLog);
  if (!ok) throw new Error('Estado salvo com formato inválido.');
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
