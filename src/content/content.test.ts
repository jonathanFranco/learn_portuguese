import { describe, expect, it } from 'vitest';
import { buildMission, questionIdsOf } from '../domain/mission';
import { recommendNextActivity } from '../domain/recommendation';
import { createInitialState } from '../domain/study';
import { playMission } from '../domain/testing/play';
import { T0 } from '../domain/testing/fixtures';
import { createRng } from '../domain/random';
import { DAY, HOUR, MINUTE } from '../domain/time';
import type { MissionKind } from '../domain/types';
import { buildCatalog, validateCatalog } from './catalog';
import { catalog } from './index';

const available = catalog.topics.filter((t) => t.available);

describe('conteúdo', () => {
  it('passa na validação de integridade', () => {
    expect(validateCatalog(catalog)).toEqual([]);
  });

  it('todo arquivo em topics/ é um assunto da trilha', () => {
    const files = Object.keys(import.meta.glob('./topics/*.ts')).map((p) => p.slice('./topics/'.length, -'.ts'.length));
    expect(files.filter((id) => !catalog.topicById.has(id))).toEqual([]);
  });

  it('aluno que acerta 95% quase nunca recebe "ponto fraco" (erro esporádico não é fraqueza)', () => {
    const rng = createRng('aluno-forte');
    let s = createInitialState('Ana', T0);
    let now = T0;
    const kinds: string[] = [];
    for (let day = 0; day < 30; day++, now += DAY) {
      for (let m = 0; m < 2; m++) {
        const rec = recommendNextActivity(s, catalog, now + m * HOUR);
        kinds.push(rec.missionKind);
        s = playMission(s, catalog, rec.mission, now + m * HOUR, () => rng() < 0.95).state;
      }
    }
    const weak = kinds.filter((k) => k === 'weak_spot').length;
    expect(weak / kinds.length).toBeLessThan(0.1);
  });

  it('jornada simulada: 30 missões recomendadas percorrem a trilha e liberam assuntos', () => {
    let s = createInitialState('Teste', T0);
    let now = T0;
    const studied = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const r = recommendNextActivity(s, catalog, now);
      studied.add(r.topicId);
      // Acerta ~80%: erra questões cujo id termina em 3 ou 7.
      s = playMission(s, catalog, r.mission, now, (id) => !/[37]$/.test(id)).state;
      now += 3 * 60 * MINUTE;
    }
    expect(studied.size).toBeGreaterThanOrEqual(5);
    expect(Object.values(s.progress).some((p) => p.mastery.level >= 2)).toBe(true);
  });

  it('quem erra muito não fica preso: nunca 3 missões seguidas no mesmo assunto', () => {
    let s = createInitialState('Teste', T0);
    let now = T0;
    const topicsInOrder: string[] = [];
    for (let i = 0; i < 12; i++) {
      const r = recommendNextActivity(s, catalog, now);
      topicsInOrder.push(r.topicId);
      s = playMission(s, catalog, r.mission, now, () => false).state;
      now += 3 * 60 * MINUTE;
    }
    for (let i = 2; i < topicsInOrder.length; i++) {
      const [a, b, c] = topicsInOrder.slice(i - 2, i + 1);
      expect(a === b && b === c, topicsInOrder.join(' → ')).toBe(false);
    }
  });
});

/** Um bloco por assunto: `npx vitest run src/content -t "assunto crase"` valida só ele. */
describe.each(available.map((t) => [t.id, t] as const))('assunto %s', (id, t) => {
  const lessons = catalog.lessonsByTopic.get(id) ?? [];
  const questions = catalog.questionsByTopic.get(id) ?? [];
  const cards = catalog.flashcardsByTopic.get(id) ?? [];

  it('passa na validação de integridade', () => {
    // Só o conteúdo deste assunto; os outros ficam como "em breve" para não entrarem na conta.
    const alone = buildCatalog(
      catalog.phases,
      catalog.topics.map((x) => ({ ...x, available: x.id === id })),
      lessons,
      questions,
      cards,
    );
    expect(validateCatalog(alone)).toEqual([]);
  });

  it('cada skill: 1 lição, ≥ 3 questões, ≥ 5 cartões; questões nas 3 dificuldades', () => {
    for (const s of t.skills) {
      expect(lessons.filter((l) => l.skillId === s.id).length, `${s.id} lições`).toBe(1);
      expect(questions.filter((q) => q.skillId === s.id).length, `${s.id} questões`).toBeGreaterThanOrEqual(3);
      expect(cards.filter((c) => c.skillId === s.id).length, `${s.id} cartões`).toBeGreaterThanOrEqual(5);
    }
    expect(new Set(questions.map((q) => q.difficulty))).toEqual(new Set([1, 2, 3]));
  });

  it('ids com o prefixo das skills do assunto', () => {
    const prefixes = new Set(t.skills.map((s) => s.id.split('-')[0]));
    for (const item of [...lessons, ...questions, ...cards]) {
      expect(prefixes.has(item.id.split('-')[0]!), item.id).toBe(true);
    }
  });

  it('usa só os tipos de questão que a UI renderiza', () => {
    expect(questions.filter((q) => q.type === 'order' || q.type === 'match').map((q) => q.id)).toEqual([]);
  });

  it('múltipla escolha: cada alternativa errada explica o porquê', () => {
    for (const q of questions) {
      if (q.type !== 'multiple_choice') continue;
      for (const a of q.alternatives) {
        if (a.id !== q.correct) expect(a.whyWrong, `${q.id} ${a.id}`).toBeTruthy();
      }
    }
  });

  it('identify_error: trechos sem espaços sobrando (são unidos com espaço)', () => {
    for (const q of questions) {
      if (q.type !== 'identify_error') continue;
      for (const s of q.segments) expect(s, q.id).toBe(s.trim());
    }
  });

  it('missão learn deixa questão da skill de reserva para o "tente uma parecida"', () => {
    lessons.forEach((lesson, i) => {
      const s = createInitialState('Ana', T0);
      s.progress[id] = {
        topicId: id, attempts: 0, correctAnswers: 0, wrongAnswers: 0,
        mastery: { score: 0, level: 0 }, review: { stage: 0, goodReviews: 0 },
        lessonsSeen: lessons.slice(0, i).map((l) => l.id),
      };
      const used = new Set(questionIdsOf(buildMission('learn', id, s, catalog)));
      const spare = questions.filter((q) => q.skillId === lesson.skillId && !used.has(q.id));
      expect(spare.length, `${lesson.id} sem questão de reserva`).toBeGreaterThan(0);
    });
  });

  it('toda missão é montável e dura de 3 a 10 min', () => {
    const kinds: MissionKind[] = ['learn', 'practice', 'review', 'weak_spot'];
    const state = createInitialState('Teste', T0);
    for (const kind of kinds) {
      const m = buildMission(kind, id, state, catalog);
      expect(m.steps.length, kind).toBeGreaterThan(0);
      expect(m.estimatedMinutes, kind).toBeGreaterThanOrEqual(3);
      expect(m.estimatedMinutes, kind).toBeLessThanOrEqual(10);
    }
  });
});
