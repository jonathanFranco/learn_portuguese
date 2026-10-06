import { accuracyOf } from '../domain/mastery';
import { visibleStreak } from '../domain/streak';
import { dayKey, daysBetweenKeys } from '../domain/time';
import { levelFromXp } from '../domain/xp';
import type { Answer, Catalog, Progress, Topic, UserState } from '../domain/types';

export interface TopicView {
  topic: Topic;
  progress?: Progress;
  accuracy?: number;
}

export function topicViews(state: UserState, catalog: Catalog): TopicView[] {
  return catalog.topics.map((topic) => {
    const progress = state.progress[topic.id];
    return { topic, progress, accuracy: accuracyOf(progress) };
  });
}

/** Assuntos iniciados, do mais fraco ao mais forte. */
export function weakSpots(state: UserState, catalog: Catalog, limit = 4): TopicView[] {
  return topicViews(state, catalog)
    .filter((v) => (v.progress?.attempts ?? 0) > 0)
    .sort((a, b) => a.progress!.mastery.score - b.progress!.mastery.score)
    .slice(0, limit);
}

/** Média de domínio dos assuntos disponíveis (0–100). */
export function overallProgress(state: UserState, catalog: Catalog): number {
  const available = catalog.topics.filter((t) => t.available);
  if (available.length === 0) return 0;
  const sum = available.reduce((s, t) => s + (state.progress[t.id]?.mastery.score ?? 0), 0);
  return Math.round(sum / available.length);
}

export function didMissionToday(state: UserState, now: number): boolean {
  return (state.dailyLog[dayKey(now)]?.missions ?? 0) > 0;
}

export function headerStats(state: UserState, now: number) {
  return {
    streak: visibleStreak(state.streak, now),
    bestStreak: state.streak.best,
    xp: state.user.totalXp,
    level: levelFromXp(state.user.totalXp),
  };
}

/** Resposta dada na sessão atual (para reconstruir o feedback após recarregar). */
export function sessionAnswer(
  state: UserState,
  questionId: string,
  kind: 'main' | 'retry',
  since: number,
): Answer | undefined {
  return state.attempts.findLast(
    (a) => a.questionId === questionId && a.at >= since && (a.context === 'retry') === (kind === 'retry'),
  )?.answer;
}

export type NodeStatus = 'soon' | 'new' | 'started';

export function nodeStatus(v: TopicView): NodeStatus {
  if (!v.topic.available) return 'soon';
  return (v.progress?.attempts ?? 0) > 0 ? 'started' : 'new';
}

/** "84% de precisão · 37 questões · 31 acertos · 6 erros" */
export function progressDetail(p: Progress | undefined): string | undefined {
  if (!p || p.attempts === 0) return undefined;
  const acc = Math.round((p.correctAnswers / p.attempts) * 100);
  const n = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;
  return [
    `${acc}% de precisão`,
    n(p.attempts, 'questão', 'questões'),
    n(p.correctAnswers, 'acerto', 'acertos'),
    n(p.wrongAnswers, 'erro', 'erros'),
  ].join(' · ');
}

/** Dias inteiros desde o último estudo; undefined se nunca estudou. */
export function daysSinceLastStudy(state: UserState, now: number): number | undefined {
  const last = state.user.lastStudiedAt;
  return last === undefined ? undefined : daysBetweenKeys(dayKey(last), dayKey(now));
}
