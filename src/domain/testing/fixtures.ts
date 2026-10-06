import { buildCatalog } from '../../content/catalog';
import type { Flashcard, Lesson, Question, Topic } from '../types';

/** Catálogo mínimo para testes: 3 assuntos (gamma sugere alpha antes), um "em breve". */
export const T0 = new Date(2026, 9, 1, 9, 0).getTime();

const topics: Topic[] = [
  {
    id: 'alpha',
    name: 'Alpha',
    description: '',
    phase: 1,
    prerequisites: [],
    skills: [
      { id: 'a1', name: 'A1' },
      { id: 'a2', name: 'A2' },
    ],
    available: true,
  },
  {
    id: 'beta',
    name: 'Beta',
    description: '',
    phase: 1,
    prerequisites: [],
    skills: [{ id: 'b1', name: 'B1' }],
    available: true,
  },
  {
    id: 'gamma',
    name: 'Gamma',
    description: '',
    phase: 2,
    prerequisites: ['alpha'],
    skills: [{ id: 'g1', name: 'G1' }],
    available: true,
  },
  {
    id: 'soon',
    name: 'Em breve',
    description: '',
    phase: 2,
    prerequisites: [],
    skills: [],
    available: false,
  },
];

const lessons: Lesson[] = [
  { id: 'alpha-l1', topicId: 'alpha', skillId: 'a1', title: 'Regra A1', summary: 's', examples: [{ sentence: 'e1' }, { sentence: 'e2' }], tips: [] },
  { id: 'alpha-l2', topicId: 'alpha', skillId: 'a2', title: 'Regra A2', summary: 's', examples: [{ sentence: 'e1' }], tips: [] },
  { id: 'beta-l1', topicId: 'beta', skillId: 'b1', title: 'Regra B1', summary: 's', examples: [{ sentence: 'e1' }], tips: [] },
  { id: 'gamma-l1', topicId: 'gamma', skillId: 'g1', title: 'Regra G1', summary: 's', examples: [{ sentence: 'e1' }], tips: [] },
];

function mc(id: string, topicId: string, skillId: string, difficulty: 1 | 2 | 3): Question {
  return {
    id,
    topicId,
    skillId,
    difficulty,
    type: 'multiple_choice',
    statement: `Questão ${id}`,
    alternatives: [
      { id: 'A', text: 'certa' },
      { id: 'B', text: 'errada', whyWrong: 'B está errada porque…' },
    ],
    correct: 'A',
    explanation: 'Explicação.',
  };
}

const questions: Question[] = [
  mc('a1-1', 'alpha', 'a1', 1),
  mc('a1-2', 'alpha', 'a1', 1),
  mc('a1-3', 'alpha', 'a1', 2),
  mc('a1-4', 'alpha', 'a1', 3),
  mc('a1-5', 'alpha', 'a1', 3),
  mc('a2-1', 'alpha', 'a2', 1),
  mc('a2-2', 'alpha', 'a2', 2),
  mc('a2-3', 'alpha', 'a2', 3),
  mc('b1-1', 'beta', 'b1', 1),
  mc('b1-2', 'beta', 'b1', 2),
  mc('b1-3', 'beta', 'b1', 2),
  mc('b1-4', 'beta', 'b1', 3),
  mc('g1-1', 'gamma', 'g1', 1),
  mc('g1-2', 'gamma', 'g1', 2),
];

function card(id: string, topicId: string, skillId: string): Flashcard {
  return { id, topicId, skillId, front: `f ${id}`, back: `b ${id}` };
}

const flashcards: Flashcard[] = [
  card('alpha-f1', 'alpha', 'a1'),
  card('alpha-f2', 'alpha', 'a1'),
  card('alpha-f3', 'alpha', 'a2'),
  card('beta-f1', 'beta', 'b1'),
  card('gamma-f1', 'gamma', 'g1'),
];

export const catalog = buildCatalog(
  [
    { id: 1, name: 'Fundamentos' },
    { id: 2, name: 'Interpretação' },
  ],
  topics,
  lessons,
  questions,
  flashcards,
);

/** Resposta certa (A) ou errada (B) para as questões do fixture. */
export const RIGHT = 'A';
export const WRONG = 'B';
