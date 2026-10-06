import type { Answer, Question } from '../../domain/types';
import type { ChoiceState } from '../components/ChoiceButton';

export interface Choice {
  value: Answer;
  label: string;
  /** Letra exibida e atalho de teclado (A–E, V/F). */
  badge?: string;
}

/** Tipos com resposta única escolhida numa lista — os 4 renderizados no MVP. */
export type ChoiceQuestion = Extract<Question, { type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'identify_error' }>;

export function isChoiceQuestion(q: Question): q is ChoiceQuestion {
  return q.type !== 'order' && q.type !== 'match';
}

export function choicesOf(q: ChoiceQuestion): Choice[] {
  switch (q.type) {
    case 'multiple_choice':
      return q.alternatives.map((a) => ({ value: a.id, label: a.text, badge: a.id }));
    case 'true_false':
      return [
        { value: true, label: 'Verdadeiro', badge: 'V' },
        { value: false, label: 'Falso', badge: 'F' },
      ];
    case 'fill_blank':
      return q.options.map((o) => ({ value: o, label: o }));
    case 'identify_error':
      return q.segments.map((s, i) => ({ value: i, label: s }));
  }
}

export interface ChoiceView {
  selected?: Answer;
  /** Presente depois de responder: marca correta/errada. */
  answered?: Answer;
}

export function choiceState(q: ChoiceQuestion, value: Answer, view: ChoiceView): ChoiceState {
  if (view.answered !== undefined) {
    if (value === q.correct) return 'correct';
    if (value === view.answered) return 'wrong';
    return 'dimmed';
  }
  return value === view.selected ? 'selected' : 'idle';
}
