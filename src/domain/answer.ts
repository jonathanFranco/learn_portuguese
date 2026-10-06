import type { Answer, Question } from './types';

/** Corrige qualquer tipo de questão. Resposta com formato errado = incorreta. */
export function isCorrect(question: Question, answer: Answer): boolean {
  switch (question.type) {
    case 'multiple_choice':
    case 'fill_blank':
    case 'true_false':
    case 'identify_error':
      return answer === question.correct;
    case 'order':
      return (
        Array.isArray(answer) &&
        answer.length === question.correct.length &&
        answer.every((item, i) => item === question.correct[i])
      );
    case 'match':
      // Resposta: lista "esquerda→direita", na ordem de `pairs`.
      return (
        Array.isArray(answer) &&
        answer.length === question.pairs.length &&
        question.pairs.every(([l, r], i) => answer[i] === `${l}→${r}`)
      );
  }
}

/** Explicação para a resposta errada: específica do distrator, senão a geral. */
export function explainMistake(question: Question, answer: Answer): string {
  if (question.type === 'multiple_choice') {
    const chosen = question.alternatives.find((a) => a.id === answer);
    if (chosen?.whyWrong) return chosen.whyWrong;
  }
  return question.explanation;
}

/** Texto curto da resposta correta, para "Resposta correta: …". */
export function correctAnswerLabel(question: Question): string {
  switch (question.type) {
    case 'multiple_choice': {
      const alt = question.alternatives.find((a) => a.id === question.correct);
      return alt ? `${alt.id}) ${alt.text}` : question.correct;
    }
    case 'true_false':
      return question.correct ? 'Verdadeiro' : 'Falso';
    case 'fill_blank':
      return question.template.replace('___', question.correct);
    case 'identify_error':
      return question.segments[question.correct] ?? '';
    case 'order':
      return question.correct.join(' ');
    case 'match':
      return question.pairs.map(([l, r]) => `${l} → ${r}`).join(' · ');
  }
}

/** Texto curto da resposta dada, para "Você marcou: …". */
export function answerLabel(question: Question, answer: Answer): string {
  switch (question.type) {
    case 'multiple_choice': {
      const alt = question.alternatives.find((a) => a.id === answer);
      return alt ? `${alt.id}) ${alt.text}` : String(answer);
    }
    case 'true_false':
      return answer ? 'Verdadeiro' : 'Falso';
    case 'identify_error':
      return typeof answer === 'number' ? (question.segments[answer] ?? '') : String(answer);
    default:
      return Array.isArray(answer) ? answer.join(' ') : String(answer);
  }
}
