import { describe, expect, it } from 'vitest';
import { catalog } from '../content';
import { emptyProgress } from '../domain/mastery';
import { createInitialState } from '../domain/study';
import { T0 } from '../domain/testing/fixtures';
import { DAY } from '../domain/time';
import { daysSinceLastStudy, nodeStatus, progressDetail, topicViews } from './selectors';

describe('selectors', () => {
  it('status dos nós da trilha', () => {
    const s = createInitialState('Ana', T0);
    s.progress['interpretacao'] = { ...emptyProgress('interpretacao'), attempts: 3 };
    const status = Object.fromEntries(topicViews(s, catalog).map((v) => [v.topic.id, nodeStatus(v)]));
    expect(status['classes-gramaticais']).toBe('new');
    expect(status['interpretacao']).toBe('started');
    expect(status['sujeito-predicado']).toBe('new'); // nada é bloqueado
    // Trilha completa: nenhum assunto "em breve". Sem conteúdo, o nó fica desabilitado.
    expect(Object.values(status)).not.toContain('soon');
    expect(nodeStatus({ topic: { ...catalog.topics[0]!, available: false }, progress: undefined })).toBe('soon');
  });

  it('detalhe de progresso', () => {
    expect(progressDetail(undefined)).toBeUndefined();
    const p = { ...emptyProgress('crase'), attempts: 37, correctAnswers: 31, wrongAnswers: 6 };
    expect(progressDetail(p)).toBe('84% de precisão · 37 questões · 31 acertos · 6 erros');
    expect(progressDetail({ ...p, attempts: 1, correctAnswers: 1, wrongAnswers: 0 })).toBe(
      '100% de precisão · 1 questão · 1 acerto · 0 erros',
    );
  });

  it('dias desde o último estudo', () => {
    const s = createInitialState('Ana', T0);
    expect(daysSinceLastStudy(s, T0)).toBeUndefined();
    s.user.lastStudiedAt = T0;
    expect(daysSinceLastStudy(s, T0 + 2 * DAY)).toBe(2);
  });
});
