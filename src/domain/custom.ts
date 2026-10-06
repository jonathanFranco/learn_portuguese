// Cartões e questões criados pela pessoa. Funções puras sobre o UserState.

import { questionIdsOf } from './mission';
import type { Flashcard, Question, UserState } from './types';

/** Item ainda sem id (criação) ou com id (edição). Distribui sobre a união de questões. */
export type Draft<T> = T extends unknown ? Omit<T, 'id'> & { id?: string } : never;

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
}

export function saveCustomFlashcard(state: UserState, card: Flashcard): UserState {
  return { ...state, custom: { ...state.custom, flashcards: upsert(state.custom.flashcards, card) } };
}

/** Apaga o cartão e o agendamento de revisão dele. */
export function deleteCustomFlashcard(state: UserState, id: string): UserState {
  const { [id]: _, ...cards } = state.cards;
  return {
    ...state,
    cards,
    custom: { ...state.custom, flashcards: state.custom.flashcards.filter((c) => c.id !== id) },
  };
}

export function saveCustomQuestion(state: UserState, question: Question): UserState {
  return { ...state, custom: { ...state.custom, questions: upsert(state.custom.questions, question) } };
}

/** Apaga a questão e o erro pendente dela. As tentativas ficam: são o histórico do domínio do assunto. */
export function deleteCustomQuestion(state: UserState, id: string): UserState {
  const session = state.activeSession;
  const inSession =
    session &&
    (questionIdsOf(session.mission).includes(id) || session.results.some((r) => r.retry?.questionId === id));
  if (inSession) throw new Error('Esta questão está na missão em andamento. Termine ou descarte a missão antes de apagar.');
  if (state.simulado?.questionIds.includes(id)) throw new Error('Esta questão está no simulado em andamento. Entregue o simulado antes de apagar.');
  const { [id]: _, ...mistakes } = state.mistakes;
  return {
    ...state,
    mistakes,
    custom: { ...state.custom, questions: state.custom.questions.filter((q) => q.id !== id) },
  };
}
