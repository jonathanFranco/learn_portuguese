import { describe, expect, it } from 'vitest';
import { answerSimulado, finishSimulado, pickSimuladoQuestions, SIMULADO_CONFIG, simuladoRemainingMs, startSimulado } from './simulado';
import { createInitialState } from './study';
import { catalog, RIGHT, T0, WRONG } from './testing/fixtures';
import { MINUTE } from './time';

const fresh = () => createInitialState('Ana', T0);

describe('simulado', () => {
  it('espalha as questões pelos assuntos e prefere as não respondidas', () => {
    const ids = pickSimuladoQuestions(fresh(), catalog, 3, 'seed');
    expect(new Set(ids.map((id) => catalog.questionById.get(id)!.topicId)).size).toBe(3);

    const s = fresh();
    const alpha = catalog.questionsByTopic.get('alpha')!;
    for (const q of alpha.slice(1)) {
      s.attempts.push({ questionId: q.id, topicId: 'alpha', skillId: q.skillId, answer: RIGHT, correct: true, difficulty: q.difficulty, context: 'mission', at: T0, durationMs: 0 });
    }
    const picked = pickSimuladoQuestions(s, catalog, 3, 'seed').filter((id) => id.startsWith('a'));
    expect(picked).toEqual([alpha[0]!.id]);
  });

  it('nunca repete questão e para quando acabam', () => {
    const ids = pickSimuladoQuestions(fresh(), catalog, 999, 'seed');
    expect(ids.length).toBe(catalog.questions.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('tempo de prova proporcional ao tamanho; só um por vez', () => {
    const s = startSimulado(fresh(), catalog, 4, T0);
    expect(s.simulado!.limitMs).toBe(4 * SIMULADO_CONFIG.minutesPerQuestion * MINUTE);
    expect(simuladoRemainingMs(s, T0 + MINUTE)).toBe(s.simulado!.limitMs - MINUTE);
    expect(() => startSimulado(s, catalog, 4, T0)).toThrow(/andamento/);
  });

  it('entrega: certas, erradas e em branco; erros viram revisão; histórico guarda a correção', () => {
    let s = startSimulado(fresh(), catalog, 3, T0);
    const [a, b, c] = s.simulado!.questionIds as [string, string, string];
    s = answerSimulado(s, a, RIGHT);
    s = answerSimulado(s, b, RIGHT);
    s = answerSimulado(s, b, WRONG); // trocou de ideia
    s = answerSimulado(s, c, RIGHT);
    s = answerSimulado(s, c, undefined); // deixou em branco
    const { state, result } = finishSimulado(s, catalog, T0 + 5 * MINUTE);

    expect(result).toMatchObject({ correct: 1, elapsedMs: 5 * MINUTE, questionIds: [a, b, c] });
    expect(result.answers).toEqual({ [a]: RIGHT, [b]: WRONG });
    expect(state.simulado).toBeNull();
    expect(state.simulados).toEqual([result]);
    expect(state.attempts.map((x) => [x.questionId, x.context])).toEqual([[a, 'simulado'], [b, 'simulado']]);
    expect(state.mistakes[b]?.resolved).toBe(false);
    expect(state.mistakes[c]).toBeUndefined();
    expect(state.streak.current).toBe(1);
  });

  it('tempo contado nunca passa do limite (entregue depois do prazo)', () => {
    const s = startSimulado(fresh(), catalog, 2, T0);
    const { result } = finishSimulado(s, catalog, T0 + 999 * MINUTE);
    expect(result.elapsedMs).toBe(s.simulado!.limitMs);
    expect(result.correct).toBe(0);
  });
});
