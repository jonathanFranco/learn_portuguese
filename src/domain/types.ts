// Modelos do domínio. Conteúdo (estático) × estado do usuário (persistido).

// ── Conteúdo ─────────────────────────────────────────

/** Markdown mínimo: **negrito**, _itálico_, `destaque`. */
export type RichText = string;

export type PhaseId = 1 | 2 | 3 | 4 | 5 | 6;

export interface Phase {
  id: PhaseId;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  phase: PhaseId;
  /** Base recomendada antes deste assunto. Só orienta — nunca bloqueia. */
  prerequisites: string[];
  skills: Skill[];
  /** false = aparece na trilha como "em breve". */
  available: boolean;
}

export interface Example {
  sentence: string;
  breakdown?: string[];
  note?: string;
}

/**
 * Dica de prova. `cobranca` = como a banca costuma cobrar a regra; `pegadinha` = a armadilha
 * clássica; `macete` = teste rápido para resolver a questão.
 */
export type TipKind = 'cobranca' | 'pegadinha' | 'macete';

export interface Tip {
  kind: TipKind;
  text: RichText;
}

/** Teoria curta. Progressive disclosure: summary → examples → deepDive. */
export interface Lesson {
  id: string;
  topicId: string;
  skillId: string;
  title: string;
  summary: RichText;
  examples: Example[];
  deepDive?: RichText;
  tips: Tip[];
}

/** Cartão de memorização: pergunta curta na frente, resposta + porquê no verso. */
export interface Flashcard {
  id: string;
  topicId: string;
  skillId: string;
  front: RichText;
  back: RichText;
}

export type Difficulty = 1 | 2 | 3;

export type AlternativeId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Alternative {
  id: AlternativeId;
  text: string;
  /** Por que esta alternativa está errada — alimenta o "Por que você errou?". */
  whyWrong?: RichText;
}

interface QuestionBase {
  id: string;
  topicId: string;
  skillId: string;
  difficulty: Difficulty;
  statement: RichText;
  passage?: RichText;
  explanation: RichText;
  source?: string;
}

export type MultipleChoiceQuestion = QuestionBase & {
  type: 'multiple_choice';
  alternatives: Alternative[];
  correct: AlternativeId;
};

export type TrueFalseQuestion = QuestionBase & {
  type: 'true_false';
  correct: boolean;
};

/** `template` contém exatamente um "___". */
export type FillBlankQuestion = QuestionBase & {
  type: 'fill_blank';
  template: string;
  options: string[];
  correct: string;
};

/** Frase dividida em trechos; a pessoa toca no trecho com erro. */
export type IdentifyErrorQuestion = QuestionBase & {
  type: 'identify_error';
  segments: string[];
  correct: number;
};

export type OrderQuestion = QuestionBase & {
  type: 'order';
  items: string[];
  correct: string[];
};

export type MatchQuestion = QuestionBase & {
  type: 'match';
  pairs: [string, string][];
};

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | IdentifyErrorQuestion
  | OrderQuestion
  | MatchQuestion;

export type QuestionType = Question['type'];

/** Cartões e questões criados pela pessoa. Entram no catálogo junto com o conteúdo do app. */
export interface CustomContent {
  flashcards: Flashcard[];
  questions: Question[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/** Conteúdo indexado, passado às funções de domínio. */
export interface Catalog {
  phases: Phase[];
  topics: Topic[];
  topicById: Map<string, Topic>;
  lessons: Lesson[];
  lessonById: Map<string, Lesson>;
  lessonsByTopic: Map<string, Lesson[]>;
  questions: Question[];
  questionById: Map<string, Question>;
  questionsByTopic: Map<string, Question[]>;
  flashcards: Flashcard[];
  flashcardById: Map<string, Flashcard>;
  flashcardsByTopic: Map<string, Flashcard[]>;
}

// ── Estado do usuário ────────────────────────────────

/** Formato da resposta depende do tipo da questão (ver domain/answer.ts). */
export type Answer = string | boolean | number | string[];

export type AttemptContext = 'mission' | 'review' | 'retry' | 'simulado';

export interface Attempt {
  questionId: string;
  topicId: string;
  skillId: string;
  answer: Answer;
  correct: boolean;
  difficulty: Difficulty;
  context: AttemptContext;
  at: number;
  durationMs: number;
}

/** 0 = não iniciado · 1 Reconhecer · 2 Aplicar · 3 Diferenciar · 4 Questões difíceis · 5 Domínio */
export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface Mastery {
  score: number;
  level: MasteryLevel;
}

export interface ReviewState {
  /** Índice em REVIEW_INTERVALS_DAYS. */
  stage: number;
  /** Ausente = assunto ainda não entrou no ciclo de revisão. */
  nextReviewAt?: number;
  /** Revisões concluídas com boa precisão (portão do nível 5). */
  goodReviews: number;
}

export interface Progress {
  topicId: string;
  attempts: number;
  correctAnswers: number;
  wrongAnswers: number;
  mastery: Mastery;
  review: ReviewState;
  lastStudiedAt?: number;
  lessonsSeen: string[];
  /** Primeira vez que atingiu nível 5 (bônus de XP é dado uma vez só). */
  masteredAt?: number;
}

export interface Mistake {
  questionId: string;
  topicId: string;
  skillId: string;
  count: number;
  lastWrongAt: number;
  /** true ao acertar a questão (ou uma da mesma skill) depois do erro. */
  resolved: boolean;
}

export type MissionKind = 'learn' | 'practice' | 'review' | 'weak_spot';

export type QuestionRole = 'practice' | 'interleave' | 'challenge';

export type MissionStep =
  | { kind: 'lesson'; lessonId: string }
  | { kind: 'example'; lessonId: string; exampleIndex: number }
  | { kind: 'question'; questionId: string; role: QuestionRole }
  | { kind: 'mistake_review'; questionId: string };

export interface Mission {
  id: string;
  kind: MissionKind;
  topicId: string;
  title: string;
  steps: MissionStep[];
  estimatedMinutes: number;
}

export interface StepResult {
  stepIndex: number;
  /** Ausente em passos de teoria. */
  questionId?: string;
  correct?: boolean;
  /** Questão semelhante sorteada após erro; `correct` ausente = ainda não respondida. */
  retry?: { questionId: string; correct?: boolean };
  xp: number;
}

export interface StudySession {
  id: string;
  mission: Mission;
  stepIndex: number;
  results: StepResult[];
  startedAt: number;
  updatedAt: number;
  /** Tempo ativo acumulado (cada passo limitado, para não contar o app esquecido aberto). */
  activeMs: number;
  stepStartedAt: number;
  /** Score de domínio do assunto ao iniciar (para a tela de conclusão). */
  masteryAtStart: number;
  xpAtStart: number;
  /** Presente enquanto pausada. */
  pausedAt?: number;
}

export interface Recommendation {
  topicId: string;
  missionKind: MissionKind;
  reason: string;
  estimatedMinutes: number;
  mission: Mission;
}

export interface User {
  name: string;
  createdAt: number;
  totalXp: number;
  missionsCompleted: number;
  lastStudiedAt?: number;
}

export interface DayLog {
  minutes: number;
  xp: number;
  missions: number;
}

export interface StreakState {
  current: number;
  best: number;
  /** 'YYYY-MM-DD' local do último dia com missão concluída. */
  lastDay?: string;
}

/** Estado de um cartão na revisão espaçada (caixas de Leitner). Ausente = cartão novo. */
export interface CardState {
  /** Índice em CARD_INTERVALS_DAYS; 0 = ainda aprendendo. */
  box: number;
  dueAt: number;
  reviews: number;
  /** Vezes que esqueceu um cartão que já sabia. */
  lapses: number;
  lastAt: number;
}

export type CardGrade = 'again' | 'good' | 'easy';

/** Prova com tempo: questões de vários assuntos, sem correção até entregar. */
export interface SimuladoSession {
  id: string;
  questionIds: string[];
  /** Por questão; ausente = em branco. Pode mudar até entregar. */
  answers: Record<string, Answer>;
  startedAt: number;
  /** Tempo de prova. Acabou, o simulado é entregue com o que houver. */
  limitMs: number;
}

/** Simulado entregue. Guarda as respostas para a correção na tela de resultado. */
export interface SimuladoResult {
  id: string;
  finishedAt: number;
  elapsedMs: number;
  questionIds: string[];
  answers: Record<string, Answer>;
  correct: number;
}

export interface UserState {
  schemaVersion: number;
  user: User;
  progress: Record<string, Progress>;
  attempts: Attempt[];
  mistakes: Record<string, Mistake>;
  activeSession: StudySession | null;
  /** ids das questões vistas nas últimas missões (evita repetição). */
  recentQuestionIds: string[];
  /** topicIds das últimas missões concluídas, mais recente por último (alternância). */
  recentMissionTopicIds: string[];
  achievements: Record<string, number>;
  /** Por flashcard id. */
  cards: Record<string, CardState>;
  custom: CustomContent;
  simulado: SimuladoSession | null;
  /** Últimos simulados entregues, mais recente por último. */
  simulados: SimuladoResult[];
  streak: StreakState;
  dailyLog: Record<string, DayLog>;
}
