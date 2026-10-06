import { describe, expect, it } from 'vitest';
import { buildMission } from './mission';
import { recommendNextActivity } from './recommendation';
import { createInitialState, startSession } from './study';
import { DAY, MINUTE } from './time';
import { catalog, T0 } from './testing/fixtures';
import { playMission } from './testing/play';

const fresh = () => createInitialState('Ana', T0);

describe('recommendNextActivity', () => {
  it('primeiro acesso: aprender o primeiro assunto da trilha', () => {
    const r = recommendNextActivity(fresh(), catalog, T0);
    expect(r).toMatchObject({ topicId: 'alpha', missionKind: 'learn', reason: 'Próximo passo da sua trilha.' });
    expect(r.estimatedMinutes).toBe(r.mission.estimatedMinutes);
  });

  it('a missão recomendada é a mesma que será iniciada (id determinístico)', () => {
    const s = fresh();
    const r = recommendNextActivity(s, catalog, T0);
    expect(buildMission(r.missionKind, r.topicId, s, catalog)).toEqual(r.mission);
  });

  it('pré-requisito não bloqueia; só "em breve" fica de fora', () => {
    let s = fresh();
    const seen = new Set<string>();
    for (let i = 0; i < 6; i++) {
      const r = recommendNextActivity(s, catalog, T0 + i * DAY);
      seen.add(r.topicId);
      s = playMission(s, catalog, r.mission, T0 + i * DAY, () => true).state;
    }
    expect(seen).toContain('gamma');
    expect(seen).not.toContain('soon');
  });

  it('alterna: depois de uma missão, o próximo assunto da trilha ganha', () => {
    const s = playMission(fresh(), catalog, buildMission('learn', 'alpha', fresh(), catalog), T0, () => true).state;
    const r = recommendNextActivity(s, catalog, T0 + MINUTE);
    expect(r.topicId).toBe('beta');
  });

  it('muitos erros recentes: missão de ponto fraco com motivo concreto', () => {
    let s = fresh();
    s = playMission(s, catalog, buildMission('practice', 'beta', s, catalog), T0, () => true).state;
    s = playMission(s, catalog, buildMission('practice', 'alpha', s, catalog), T0 + 10 * MINUTE, () => false).state;
    s = playMission(s, catalog, buildMission('practice', 'beta', s, catalog), T0 + 20 * MINUTE, () => true).state;
    const r = recommendNextActivity(s, catalog, T0 + 30 * MINUTE);
    expect(r.topicId).toBe('alpha');
    expect(r.missionKind).toBe('weak_spot');
    expect(r.reason).toMatch(/^Você errou \d+ das últimas \d+ questões\.$/);
  });

  it('revisão vencida vira missão de revisão', () => {
    let s = fresh();
    for (let i = 0; i < 4 && s.progress.alpha?.review.nextReviewAt === undefined; i++) {
      s = playMission(s, catalog, buildMission('practice', 'alpha', s, catalog), T0 + i * 10 * MINUTE, () => true).state;
    }
    s = playMission(s, catalog, buildMission('practice', 'beta', s, catalog), T0 + 50 * MINUTE, () => true).state;
    const r = recommendNextActivity(s, catalog, T0 + 3 * DAY);
    expect(r.missionKind).toBe('review');
    expect(r.reason).toContain('Hora de revisar');
  });

  it('não muda por existir sessão ativa', () => {
    const s = fresh();
    const r = recommendNextActivity(s, catalog, T0);
    const withSession = startSession(s, r.mission, T0);
    expect(recommendNextActivity(withSession, catalog, T0).mission.id).toBe(r.mission.id);
  });
});
