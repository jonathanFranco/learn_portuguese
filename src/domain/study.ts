// Transições do estado do usuário durante o estudo. Todas puras: (estado, …, now) → novo estado.

import { isCorrect } from './answer';
import { unlockAchievements } from './achievements';
import { computeMastery, emptyProgress } from './mastery';
import { findSimilarQuestion, questionIdsOf } from './mission';
import { afterMistake, afterReviewSession, maybeEnterReview } from './review';
import { registerStudyDay } from './streak';
import { dayKey, MINUTE } from './time';
import { XP, xpForAnswer } from './xp';
import type {
  Answer,
  Attempt,
  AttemptContext,
  Catalog,
  Mission,
  MissionStep,
  Question,
  StepResult,
  StudySession,
  UserState,
} from './types';

export const SCHEMA_VERSION = 4;

/** Um passo nunca conta mais que isso de tempo ativo (app esquecido aberto). */
export const STEP_TIME_CAP = 5 * MINUTE;
/** Tentativas guardadas por assunto. */
export const ATTEMPTS_PER_TOPIC = 300;
/** Questões lembradas para evitar repetição entre missões. */
const RECENT_QUESTIONS = 40;
const RECENT_MISSIONS = 5;

export function createInitialState(name: string, now: number): UserState {
  return {
    schemaVersion: SCHEMA_VERSION,
    user: { name, createdAt: now, totalXp: 0, missionsCompleted: 0 },
    progress: {},
    attempts: [],
    mistakes: {},
    activeSession: null,
    recentQuestionIds: [],
    recentMissionTopicIds: [],
    achievements: {},
    cards: {},
    custom: { flashcards: [], questions: [] },
    simulado: null,
    simulados: [],
    streak: { current: 0, best: 0 },
    dailyLog: {},
  };
}

// ── Sessão ───────────────────────────────────────────

export function startSession(state: UserState, mission: Mission, now: number): UserState {
  return {
    ...state,
    activeSession: {
      id: mission.id,
      mission,
      stepIndex: 0,
      results: [],
      startedAt: now,
      updatedAt: now,
      activeMs: 0,
      stepStartedAt: now,
      masteryAtStart: state.progress[mission.topicId]?.mastery.score ?? 0,
      xpAtStart: state.user.totalXp,
    },
  };
}

export function pauseSession(state: UserState, now: number): UserState {
  const s = state.activeSession;
  if (!s || s.pausedAt !== undefined) return state;
  return withSession(state, { ...s, activeMs: s.activeMs + stepElapsed(s, now), pausedAt: now }, now);
}

/** Retomar após pausa ou ao reabrir o app: o relógio do passo recomeça agora. */
export function resumeSession(state: UserState, now: number): UserState {
  const s = state.activeSession;
  if (!s) return state;
  const { pausedAt: _, ...rest } = s;
  return withSession(state, { ...rest, stepStartedAt: now }, now);
}

export function discardSession(state: UserState): UserState {
  return { ...state, activeSession: null };
}

export function currentStep(session: StudySession): MissionStep | undefined {
  return session.mission.steps[session.stepIndex];
}

export function currentResult(session: StudySession): StepResult | undefined {
  return session.results.find((r) => r.stepIndex === session.stepIndex);
}

/** Passo pode avançar: teoria sempre; questão respondida (e retry respondido, se houver). */
export function canAdvance(session: StudySession): boolean {
  const step = currentStep(session);
  if (!step) return false;
  if (step.kind === 'lesson' || step.kind === 'example') return true;
  const r = currentResult(session);
  return r !== undefined && (r.retry === undefined || r.retry.correct !== undefined);
}

export function isSessionFinished(session: StudySession): boolean {
  return session.stepIndex >= session.mission.steps.length;
}

export interface AnswerOutcome {
  state: UserState;
  correct: boolean;
  xp: number;
  /** Questão semelhante sorteada após erro (pode não existir). */
  retryQuestionId?: string;
  unlocked: string[];
}

/** Responde a questão do passo atual. */
export function answerStep(
  state: UserState,
  catalog: Catalog,
  answer: Answer,
  now: number,
): AnswerOutcome {
  const session = requireSession(state);
  const step = currentStep(session);
  if (!step || (step.kind !== 'question' && step.kind !== 'mistake_review')) {
    throw new Error('O passo atual não é uma questão.');
  }
  if (currentResult(session)) throw new Error('Questão já respondida.');

  const question = requireQuestion(catalog, step.questionId);
  const context: AttemptContext = session.mission.kind === 'review' ? 'review' : 'mission';
  const durationMs = stepElapsed(session, now);
  const rec = recordAttempt(state, catalog, question, answer, context, durationMs, now);

  let retry: StepResult['retry'];
  if (!rec.correct) {
    const exclude = new Set([
      ...questionIdsOf(session.mission),
      ...session.results.flatMap((r) => (r.retry ? [r.retry.questionId] : [])),
    ]);
    const similar = findSimilarQuestion(question, catalog, exclude, `${session.id}:${step.questionId}`);
    if (similar) retry = { questionId: similar.id };
  }

  const result: StepResult = {
    stepIndex: session.stepIndex,
    questionId: question.id,
    correct: rec.correct,
    xp: rec.xp,
    ...(retry && { retry }),
  };
  const next = withSession(
    rec.state,
    { ...session, results: [...session.results, result] },
    now,
  );
  return { state: next, correct: rec.correct, xp: rec.xp, retryQuestionId: retry?.questionId, unlocked: rec.unlocked };
}

/** Responde a questão semelhante ("agora tente novamente"). */
export function answerRetry(
  state: UserState,
  catalog: Catalog,
  answer: Answer,
  now: number,
): AnswerOutcome {
  const session = requireSession(state);
  const result = currentResult(session);
  if (!result?.retry || result.retry.correct !== undefined) {
    throw new Error('Não há questão de nova tentativa pendente.');
  }
  const question = requireQuestion(catalog, result.retry.questionId);
  const rec = recordAttempt(state, catalog, question, answer, 'retry', stepElapsed(session, now), now);

  let s = rec.state;
  if (rec.correct && result.questionId) s = resolveMistake(s, result.questionId);

  const updated: StepResult = {
    ...result,
    retry: { questionId: question.id, correct: rec.correct },
    xp: result.xp + rec.xp,
  };
  const next = withSession(
    s,
    { ...session, results: session.results.map((r) => (r === result ? updated : r)) },
    now,
  );
  return { state: next, correct: rec.correct, xp: rec.xp, unlocked: rec.unlocked };
}

/** Avança para o próximo passo. Lição/exemplo contam como vistos. */
export function advanceStep(state: UserState, now: number): UserState {
  const session = requireSession(state);
  if (!canAdvance(session)) throw new Error('O passo atual ainda não foi concluído.');
  const step = currentStep(session)!;

  let s = state;
  if (step.kind === 'lesson') s = markLessonSeen(s, session.mission.topicId, step.lessonId);

  return withSession(
    s,
    {
      ...session,
      stepIndex: session.stepIndex + 1,
      activeMs: session.activeMs + stepElapsed(session, now),
      stepStartedAt: now,
    },
    now,
  );
}

export interface MissionSummary {
  mission: Mission;
  xpEarned: number;
  minutes: number;
  questions: number;
  correct: number;
  masteryBefore: number;
  masteryAfter: number;
  unlocked: string[];
}

/** Fecha a missão: bônus, sequência, revisão espaçada, registro do dia. */
export function completeMission(
  state: UserState,
  catalog: Catalog,
  now: number,
): { state: UserState; summary: MissionSummary } {
  const session = requireSession(state);
  if (!isSessionFinished(session)) throw new Error('A missão ainda tem passos.');
  const { mission } = session;

  const answered = session.results.filter((r) => r.correct !== undefined);
  const correct = answered.filter((r) => r.correct).length;
  const accuracy = answered.length > 0 ? correct / answered.length : 1;

  // Revisão espaçada é ajustada uma vez por missão, não a cada erro.
  let progress = state.progress[mission.topicId] ?? emptyProgress(mission.topicId);
  if (mission.kind === 'review') {
    progress = { ...progress, review: afterReviewSession(progress.review, accuracy, now) };
    progress = withMastery(progress, state, catalog);
  } else if (answered.some((r) => !r.correct)) {
    progress = { ...progress, review: afterMistake(progress.review, now) };
  }

  const minutes = Math.max(1, Math.round(session.activeMs / MINUTE));
  const today = dayKey(now);
  const day = state.dailyLog[today] ?? { minutes: 0, xp: 0, missions: 0 };

  let s: UserState = {
    ...state,
    user: {
      ...state.user,
      totalXp: state.user.totalXp + XP.missionComplete,
      missionsCompleted: state.user.missionsCompleted + 1,
      lastStudiedAt: now,
    },
    progress: { ...state.progress, [mission.topicId]: progress },
    streak: registerStudyDay(state.streak, now),
    dailyLog: {
      ...state.dailyLog,
      [today]: {
        minutes: day.minutes + minutes,
        xp: day.xp + XP.missionComplete,
        missions: day.missions + 1,
      },
    },
    recentQuestionIds: [
      ...state.recentQuestionIds,
      ...questionIdsOf(mission),
      ...session.results.flatMap((r) => (r.retry ? [r.retry.questionId] : [])),
    ].slice(-RECENT_QUESTIONS),
    recentMissionTopicIds: [...state.recentMissionTopicIds, mission.topicId].slice(-RECENT_MISSIONS),
    activeSession: null,
  };
  s = applyMasteryBonus(s, mission.topicId, now);
  const ach = unlockAchievements(s, now);
  s = ach.state;

  const unlockedDuringSession = Object.entries(s.achievements)
    .filter(([, at]) => at >= session.startedAt)
    .map(([id]) => id);

  return {
    state: s,
    summary: {
      mission,
      xpEarned: s.user.totalXp - session.xpAtStart,
      minutes,
      questions: answered.length,
      correct,
      masteryBefore: session.masteryAtStart,
      masteryAfter: s.progress[mission.topicId]?.mastery.score ?? 0,
      unlocked: unlockedDuringSession,
    },
  };
}

// ── Internos ─────────────────────────────────────────

/** Registra uma resposta: tentativa, XP, erro pendente, domínio do assunto. Também usado pelo simulado. */
export function recordAttempt(
  state: UserState,
  catalog: Catalog,
  question: Question,
  answer: Answer,
  context: AttemptContext,
  durationMs: number,
  now: number,
): { state: UserState; correct: boolean; xp: number; unlocked: string[] } {
  const correct = isCorrect(question, answer);
  const xp = xpForAnswer(correct, question.difficulty, context === 'retry');

  const attempt: Attempt = {
    questionId: question.id,
    topicId: question.topicId,
    skillId: question.skillId,
    answer,
    correct,
    difficulty: question.difficulty,
    context,
    at: now,
    durationMs,
  };

  let s: UserState = {
    ...state,
    attempts: pruneAttempts([...state.attempts, attempt], question.topicId),
    user: { ...state.user, totalXp: state.user.totalXp + xp, lastStudiedAt: now },
    dailyLog: addDayXp(state.dailyLog, now, xp),
  };

  if (correct) {
    if (context !== 'retry') s = resolveMistake(s, question.id);
  } else {
    const prev = s.mistakes[question.id];
    s = {
      ...s,
      mistakes: {
        ...s.mistakes,
        [question.id]: {
          questionId: question.id,
          topicId: question.topicId,
          skillId: question.skillId,
          count: (prev?.count ?? 0) + 1,
          lastWrongAt: now,
          resolved: false,
        },
      },
    };
  }

  const prev = s.progress[question.topicId] ?? emptyProgress(question.topicId);
  let progress = {
    ...prev,
    attempts: prev.attempts + 1,
    correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
    wrongAnswers: prev.wrongAnswers + (correct ? 0 : 1),
    lastStudiedAt: now,
  };
  progress = withMastery(progress, s, catalog);
  progress = { ...progress, review: maybeEnterReview(progress.review, progress.mastery.level, now) };

  s = { ...s, progress: { ...s.progress, [question.topicId]: progress } };
  s = applyMasteryBonus(s, question.topicId, now);
  const ach = unlockAchievements(s, now);
  return { state: ach.state, correct, xp, unlocked: ach.unlocked };
}

function withMastery<P extends UserState['progress'][string]>(
  progress: P,
  state: UserState,
  catalog: Catalog,
): P {
  const topic = catalog.topicById.get(progress.topicId);
  if (!topic) return progress;
  const attempts = state.attempts.filter((a) => a.topicId === topic.id);
  const mistakes = Object.values(state.mistakes).filter((m) => m.topicId === topic.id);
  return { ...progress, mastery: computeMastery(topic, attempts, mistakes, progress.review.goodReviews) };
}

/** +100 XP na primeira vez que o assunto chega ao nível 5. */
function applyMasteryBonus(state: UserState, topicId: string, now: number): UserState {
  const p = state.progress[topicId];
  if (!p || p.mastery.level < 5 || p.masteredAt !== undefined) return state;
  return {
    ...state,
    progress: { ...state.progress, [topicId]: { ...p, masteredAt: now } },
    user: { ...state.user, totalXp: state.user.totalXp + XP.topicMastered },
    dailyLog: addDayXp(state.dailyLog, now, XP.topicMastered),
  };
}

function resolveMistake(state: UserState, questionId: string): UserState {
  const m = state.mistakes[questionId];
  if (!m || m.resolved) return state;
  return { ...state, mistakes: { ...state.mistakes, [questionId]: { ...m, resolved: true } } };
}

function markLessonSeen(state: UserState, topicId: string, lessonId: string): UserState {
  const p = state.progress[topicId] ?? emptyProgress(topicId);
  if (p.lessonsSeen.includes(lessonId)) return state;
  return {
    ...state,
    progress: { ...state.progress, [topicId]: { ...p, lessonsSeen: [...p.lessonsSeen, lessonId] } },
  };
}

function pruneAttempts(attempts: Attempt[], topicId: string): Attempt[] {
  let excess = attempts.filter((a) => a.topicId === topicId).length - ATTEMPTS_PER_TOPIC;
  if (excess <= 0) return attempts;
  return attempts.filter((a) => a.topicId !== topicId || excess-- <= 0);
}

export function addDayXp(log: UserState['dailyLog'], now: number, xp: number): UserState['dailyLog'] {
  if (xp === 0) return log;
  const key = dayKey(now);
  const day = log[key] ?? { minutes: 0, xp: 0, missions: 0 };
  return { ...log, [key]: { ...day, xp: day.xp + xp } };
}

function stepElapsed(session: StudySession, now: number): number {
  if (session.pausedAt !== undefined) return 0;
  return Math.max(0, Math.min(STEP_TIME_CAP, now - session.stepStartedAt));
}

function withSession(state: UserState, session: StudySession, now: number): UserState {
  return { ...state, activeSession: { ...session, updatedAt: now } };
}

function requireSession(state: UserState): StudySession {
  if (!state.activeSession) throw new Error('Nenhuma sessão ativa.');
  return state.activeSession;
}

function requireQuestion(catalog: Catalog, id: string): Question {
  const q = catalog.questionById.get(id);
  if (!q) throw new Error(`Questão desconhecida: ${id}`);
  return q;
}
