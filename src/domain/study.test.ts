import { describe, expect, it } from 'vitest';
import { buildMission } from './mission';
import {
  advanceStep,
  answerRetry,
  answerStep,
  canAdvance,
  createInitialState,
  currentResult,
  pauseSession,
  resumeSession,
  startSession,
  STEP_TIME_CAP,
} from './study';
import { DAY, MINUTE } from './time';
import { catalog, RIGHT, T0, WRONG } from './testing/fixtures';
import { playMission } from './testing/play';

const fresh = () => createInitialState('Ana', T0);

/** Avança pelos passos de teoria até a primeira questão. */
function toFirstQuestion(state: ReturnType<typeof fresh>, now: number) {
  let s = state;
  while (s.activeSession!.mission.steps[s.activeSession!.stepIndex]!.kind === 'lesson') s = advanceStep(s, now);
  return s;
}

describe('fluxo de erro', () => {
  it('erro registra Mistake, sorteia semelhante; acertar a semelhante resolve', () => {
    const mission = buildMission('learn', 'alpha', fresh(), catalog);
    let s = toFirstQuestion(startSession(fresh(), mission, T0), T0);

    const wrong = answerStep(s, catalog, WRONG, T0 + 1000);
    s = wrong.state;
    expect(wrong.correct).toBe(false);
    expect(wrong.xp).toBe(0);
    const qid = currentResult(s.activeSession!)!.questionId!;
    expect(s.mistakes[qid]).toMatchObject({ count: 1, resolved: false });
    expect(wrong.retryQuestionId).toBeDefined();
    expect(wrong.retryQuestionId).not.toBe(qid);
    expect(canAdvance(s.activeSession!)).toBe(false); // falta a nova tentativa

    const retry = answerRetry(s, catalog, RIGHT, T0 + 2000);
    s = retry.state;
    expect(retry.xp).toBe(5);
    expect(s.mistakes[qid]!.resolved).toBe(true);
    expect(s.attempts.at(-1)!.context).toBe('retry');
    expect(canAdvance(s.activeSession!)).toBe(true);
  });

  it('não deixa responder duas vezes nem avançar sem responder', () => {
    const mission = buildMission('practice', 'alpha', fresh(), catalog);
    let s = startSession(fresh(), mission, T0);
    expect(() => advanceStep(s, T0)).toThrow();
    s = answerStep(s, catalog, RIGHT, T0).state;
    expect(() => answerStep(s, catalog, RIGHT, T0)).toThrow();
  });
});

describe('missão completa', () => {
  it('dá XP, bônus de missão, sequência, conquista e limpa a sessão', () => {
    const state = fresh();
    const mission = buildMission('learn', 'alpha', state, catalog);
    const { state: s, summary } = playMission(state, catalog, mission, T0, () => true);

    const questions = mission.steps.filter((st) => st.kind === 'question').length;
    expect(summary.questions).toBe(questions);
    expect(summary.correct).toBe(questions);
    expect(summary.xpEarned).toBe(s.user.totalXp);
    expect(s.user.totalXp).toBeGreaterThanOrEqual(questions * 10 + 50);
    expect(s.user.missionsCompleted).toBe(1);
    expect(s.streak.current).toBe(1);
    expect(s.activeSession).toBeNull();
    expect(s.achievements.first_step).toBeDefined();
    expect(summary.unlocked).toContain('first_step');
    expect(s.progress.alpha!.lessonsSeen).toEqual(['alpha-l1']);
    expect(s.recentMissionTopicIds).toEqual(['alpha']);
    expect(summary.minutes).toBeGreaterThanOrEqual(1);
  });

  it('missão de revisão boa sobe o estágio de revisão', () => {
    let s = fresh();
    // Treina até entrar no ciclo de revisão (nível 2).
    for (let i = 0; i < 4 && s.progress.alpha?.review.nextReviewAt === undefined; i++) {
      s = playMission(s, catalog, buildMission('practice', 'alpha', s, catalog), T0 + i * MINUTE * 10, () => true).state;
    }
    expect(s.progress.alpha!.review.nextReviewAt).toBeDefined();
    const later = T0 + 2 * DAY;
    s = playMission(s, catalog, buildMission('review', 'alpha', s, catalog), later, () => true).state;
    expect(s.progress.alpha!.review).toMatchObject({ stage: 1, goodReviews: 1 });
  });
});

describe('retomada e tempo', () => {
  it('sessão sobrevive a serialização e continua do mesmo passo', () => {
    const mission = buildMission('practice', 'alpha', fresh(), catalog);
    let s = startSession(fresh(), mission, T0);
    s = answerStep(s, catalog, RIGHT, T0 + 1000).state;
    s = advanceStep(s, T0 + 2000);
    const restored = resumeSession(JSON.parse(JSON.stringify(s)), T0 + 3 * DAY);
    expect(restored.activeSession!.stepIndex).toBe(1);
    expect(restored.activeSession!.results).toHaveLength(1);
    expect(restored.user.totalXp).toBe(s.user.totalXp);
    expect(() => answerStep(restored, catalog, RIGHT, T0 + 3 * DAY + 1000)).not.toThrow();
  });

  it('pausa não conta tempo e cada passo tem teto', () => {
    const mission = buildMission('practice', 'alpha', fresh(), catalog);
    let s = startSession(fresh(), mission, T0);
    s = pauseSession(s, T0 + MINUTE);
    expect(s.activeSession!.activeMs).toBe(MINUTE);
    s = resumeSession(s, T0 + 60 * MINUTE);
    s = answerStep(s, catalog, RIGHT, T0 + 61 * MINUTE).state;
    s = advanceStep(s, T0 + 61 * MINUTE);
    expect(s.activeSession!.activeMs).toBe(2 * MINUTE);
    s = answerStep(s, catalog, RIGHT, T0 + 200 * MINUTE).state;
    s = advanceStep(s, T0 + 200 * MINUTE);
    expect(s.activeSession!.activeMs).toBe(2 * MINUTE + STEP_TIME_CAP);
  });
});
