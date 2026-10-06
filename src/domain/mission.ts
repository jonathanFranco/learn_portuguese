import { createRng, shuffle } from './random';
import type {
  Catalog,
  Difficulty,
  Lesson,
  MasteryLevel,
  Mission,
  MissionKind,
  MissionStep,
  Question,
  QuestionRole,
  Skill,
  Topic,
  UserState,
} from './types';

/** Minutos estimados por passo. */
export const STEP_MINUTES = {
  lesson: 1.5,
  example: 0.5,
  question: 0.75,
  passageMultiplier: 1.5,
  mistake_review: 1,
} as const;

/** Id determinístico: a recomendação e a missão iniciada são a mesma missão. */
export function missionId(kind: MissionKind, topicId: string, state: UserState): string {
  return `${kind}:${topicId}:${state.user.missionsCompleted}`;
}

export function buildMission(
  kind: MissionKind,
  topicId: string,
  state: UserState,
  catalog: Catalog,
): Mission {
  const topic = catalog.topicById.get(topicId);
  if (!topic) throw new Error(`Assunto desconhecido: ${topicId}`);

  const id = missionId(kind, topicId, state);
  const b = new MissionBuilder(topic, state, catalog, createRng(id));
  const title = RECIPES[kind](b);
  if (b.steps.length === 0) throw new Error(`Assunto sem conteúdo suficiente: ${topicId}`);

  return {
    id,
    kind,
    topicId,
    title,
    steps: b.steps,
    estimatedMinutes: estimateMinutes(b.steps, catalog),
  };
}

/** Questões numa missão "Minhas questões". */
export const CUSTOM_MISSION_SIZE = 8;

/** Prática só com as questões que a pessoa adicionou ao assunto (aba Questões). */
export function buildCustomMission(topicId: string, state: UserState, catalog: Catalog): Mission {
  const topic = catalog.topicById.get(topicId);
  if (!topic) throw new Error(`Assunto desconhecido: ${topicId}`);

  const id = `mine:${topicId}:${state.user.missionsCompleted}`;
  const b = new MissionBuilder(topic, state, catalog, createRng(id));
  b.questions(CUSTOM_MISSION_SIZE, 'practice', { only: new Set(state.custom.questions.map((q) => q.id)) });
  if (b.steps.length === 0) throw new Error(`Nenhuma questão sua em ${topic.name}.`);

  return {
    id,
    kind: 'practice',
    topicId,
    title: `Minhas questões: ${topic.name}`,
    steps: b.steps,
    estimatedMinutes: estimateMinutes(b.steps, catalog),
  };
}

export function estimateMinutes(steps: readonly MissionStep[], catalog: Catalog): number {
  let total = 0;
  for (const step of steps) {
    if (step.kind === 'question' || step.kind === 'mistake_review') {
      const q = catalog.questionById.get(step.questionId);
      const base = step.kind === 'question' ? STEP_MINUTES.question : STEP_MINUTES.mistake_review;
      total += q?.passage ? base * STEP_MINUTES.passageMultiplier : base;
    } else {
      total += STEP_MINUTES[step.kind];
    }
  }
  return Math.max(3, Math.ceil(total));
}

/** Receitas: cada uma alterna teoria, prática, interleaving e desafio. Retorna o título. */
const RECIPES: Record<MissionKind, (b: MissionBuilder) => string> = {
  learn(b) {
    const lesson = b.nextLesson();
    if (!lesson) return RECIPES.practice(b);
    b.lesson(lesson);
    b.questions(2, 'practice', { skillId: lesson.skillId, maxDifficulty: 2, reserve: 1 });
    if (lesson.examples.length > 1) b.example(lesson, 1);
    b.interleave(lesson.skillId);
    if (!b.questions(1, 'challenge', { skillId: lesson.skillId, minDifficulty: 2, reserve: 1 }))
      b.questions(1, 'challenge', { minDifficulty: 2 });
    return `Aprender: ${lesson.title}`;
  },

  practice(b) {
    b.questions(3, 'practice', { spreadSkills: true });
    b.interleave();
    b.questions(1, 'challenge', { minDifficulty: b.targetDifficulty() });
    b.mistakeReviews(1);
    return `Praticar ${b.topic.name}`;
  },

  review(b) {
    const reviewed = b.mistakeReviews(2);
    b.questions(4 - reviewed, 'practice', { spreadSkills: true, preferSeen: true });
    return `Revisar ${b.topic.name}`;
  },

  weak_spot(b) {
    const skill = b.weakestSkill();
    const lesson = b.lessonFor(skill.id);
    if (lesson) b.lesson(lesson);
    b.questions(2, 'practice', { skillId: skill.id, maxDifficulty: 2, reserve: 1 });
    b.mistakeReviews(2);
    if (!b.questions(1, 'challenge', { skillId: skill.id, minDifficulty: 2, reserve: 1 }))
      b.questions(1, 'challenge', { minDifficulty: 2 });
    return `Reforçar: ${skill.name}`;
  },
};

interface PickOptions {
  skillId?: string;
  excludeSkillId?: string;
  minDifficulty?: number;
  maxDifficulty?: number;
  /** Distribui entre skills diferentes. */
  spreadSkills?: boolean;
  /** Revisão: prioriza questões já respondidas (testa lembrança). */
  preferSeen?: boolean;
  /** Com `skillId`: deixa N questões da skill sem usar, para o "tente uma parecida" após erro. */
  reserve?: number;
  /** Só estas questões (ex.: as que a pessoa adicionou). */
  only?: ReadonlySet<string>;
}

class MissionBuilder {
  readonly steps: MissionStep[] = [];
  private readonly used = new Set<string>();
  private readonly recent: Set<string>;
  private readonly seen: Set<string>;
  private readonly level: MasteryLevel;

  constructor(
    readonly topic: Topic,
    private readonly state: UserState,
    private readonly catalog: Catalog,
    private readonly rng: () => number,
  ) {
    this.recent = new Set(state.recentQuestionIds);
    this.seen = new Set(state.attempts.map((a) => a.questionId));
    this.level = state.progress[topic.id]?.mastery.level ?? 0;
  }

  targetDifficulty(): Difficulty {
    if (this.level >= 4) return 3;
    if (this.level >= 2) return 2;
    return 1;
  }

  lesson(lesson: Lesson) {
    this.steps.push({ kind: 'lesson', lessonId: lesson.id });
  }

  example(lesson: Lesson, exampleIndex: number) {
    this.steps.push({ kind: 'example', lessonId: lesson.id, exampleIndex });
  }

  /** Primeira lição (na ordem do conteúdo) ainda não vista. */
  nextLesson(): Lesson | undefined {
    const seen = new Set(this.state.progress[this.topic.id]?.lessonsSeen ?? []);
    return this.catalog.lessonsByTopic.get(this.topic.id)?.find((l) => !seen.has(l.id));
  }

  lessonFor(skillId: string): Lesson | undefined {
    return this.catalog.lessonsByTopic.get(this.topic.id)?.find((l) => l.skillId === skillId);
  }

  /** Skill com menor precisão nas tentativas recentes; sem dados, a primeira. */
  weakestSkill(): Skill {
    const stats = new Map<string, { ok: number; n: number }>();
    const recent = this.state.attempts.filter((a) => a.topicId === this.topic.id).slice(-30);
    for (const a of recent) {
      const s = stats.get(a.skillId) ?? { ok: 0, n: 0 };
      s.n++;
      if (a.correct) s.ok++;
      stats.set(a.skillId, s);
    }
    let weakest = this.topic.skills[0]!;
    let worst = Infinity;
    for (const skill of this.topic.skills) {
      const s = stats.get(skill.id);
      if (!s) continue;
      const acc = s.ok / s.n;
      if (acc < worst) {
        worst = acc;
        weakest = skill;
      }
    }
    return weakest;
  }

  /** Adiciona até `count` questões do assunto. Retorna quantas adicionou. */
  questions(count: number, role: QuestionRole, opts: PickOptions = {}): number {
    const pool = (this.catalog.questionsByTopic.get(this.topic.id) ?? []).filter(
      (q) =>
        (!opts.skillId || q.skillId === opts.skillId) &&
        (!opts.only || opts.only.has(q.id)) &&
        q.skillId !== opts.excludeSkillId &&
        q.difficulty >= (opts.minDifficulty ?? 1) &&
        q.difficulty <= (opts.maxDifficulty ?? 3),
    );
    let limit = count;
    if (opts.skillId && opts.reserve) {
      const unused = (this.catalog.questionsByTopic.get(this.topic.id) ?? []).filter(
        (q) => q.skillId === opts.skillId && !this.used.has(q.id),
      ).length;
      limit = Math.min(count, Math.max(0, unused - opts.reserve));
    }
    const picked = this.pick(pool, limit, opts);
    for (const q of picked) this.steps.push({ kind: 'question', questionId: q.id, role });
    return picked.length;
  }

  /** Uma questão de outro assunto já estudado; sem nenhum, uma do próprio assunto, fora da skill em foco. */
  interleave(focusSkillId?: string): void {
    const others = this.catalog.topics.filter(
      (t) => t.id !== this.topic.id && (this.state.progress[t.id]?.attempts ?? 0) > 0,
    );
    const pool = others.flatMap((t) =>
      (this.catalog.questionsByTopic.get(t.id) ?? []).filter((q) => q.difficulty <= 2),
    );
    const [q] = this.pick(pool, 1, {});
    if (q) this.steps.push({ kind: 'question', questionId: q.id, role: 'interleave' });
    else this.questions(1, 'practice', { spreadSkills: true, excludeSkillId: focusSkillId });
  }

  /** Reapresenta erros não resolvidos do assunto, mais repetidos e recentes primeiro. */
  mistakeReviews(max: number): number {
    // Questão fora do catálogo (a pessoa apagou a dela, ou o conteúdo mudou) não volta.
    const mistakes = Object.values(this.state.mistakes)
      .filter(
        (m) =>
          m.topicId === this.topic.id &&
          !m.resolved &&
          !this.used.has(m.questionId) &&
          this.catalog.questionById.has(m.questionId),
      )
      .sort((a, b) => b.count - a.count || b.lastWrongAt - a.lastWrongAt)
      .slice(0, max);
    for (const m of mistakes) {
      this.used.add(m.questionId);
      this.steps.push({ kind: 'mistake_review', questionId: m.questionId });
    }
    return mistakes.length;
  }

  private pick(pool: readonly Question[], count: number, opts: PickOptions): Question[] {
    if (count <= 0) return [];
    const target = this.targetDifficulty();
    const score = (q: Question) => {
      let s = 0;
      if (this.recent.has(q.id)) s += 10;
      if (opts.preferSeen ? !this.seen.has(q.id) : this.seen.has(q.id)) s += 3;
      s += Math.abs(q.difficulty - target);
      return s;
    };
    const candidates = shuffle(
      pool.filter((q) => !this.used.has(q.id)),
      this.rng,
    ).sort((a, b) => score(a) - score(b));

    const out: Question[] = [];
    const skillsTaken = new Set<string>();
    if (opts.spreadSkills) {
      for (const q of candidates) {
        if (out.length >= count) break;
        if (skillsTaken.has(q.skillId)) continue;
        skillsTaken.add(q.skillId);
        out.push(q);
      }
    }
    for (const q of candidates) {
      if (out.length >= count) break;
      if (!out.includes(q)) out.push(q);
    }
    for (const q of out) this.used.add(q.id);
    return out;
  }
}

/** Questão da mesma skill, ainda não usada na sessão, para o "agora tente de novo". */
export function findSimilarQuestion(
  question: Question,
  catalog: Catalog,
  exclude: ReadonlySet<string>,
  seed: string,
): Question | undefined {
  const pool = (catalog.questionsByTopic.get(question.topicId) ?? []).filter(
    (q) => q.skillId === question.skillId && q.id !== question.id && !exclude.has(q.id),
  );
  if (pool.length === 0) return undefined;
  // Prefere dificuldade igual ou menor: o objetivo é consolidar, não punir.
  const easier = pool.filter((q) => q.difficulty <= question.difficulty);
  const options = easier.length > 0 ? easier : pool;
  return shuffle(options, createRng(seed))[0];
}

/** Ids de questões que a missão usa (passos + retries já sorteados). */
export function questionIdsOf(mission: Mission): string[] {
  return mission.steps.flatMap((s) =>
    s.kind === 'question' || s.kind === 'mistake_review' ? [s.questionId] : [],
  );
}
