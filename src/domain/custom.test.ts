import { describe, expect, it } from 'vitest';
import { extendCatalog } from '../content/catalog';
import { deleteCustomFlashcard, deleteCustomQuestion, saveCustomFlashcard, saveCustomQuestion } from './custom';
import { buildCustomMission, buildMission, CUSTOM_MISSION_SIZE, questionIdsOf } from './mission';
import { createInitialState, startSession } from './study';
import { catalog, T0 } from './testing/fixtures';
import type { Flashcard, Question, UserState } from './types';

const fresh = () => createInitialState('Ana', T0);

const myCard = (id: string, over: Partial<Flashcard> = {}): Flashcard => ({
  id, topicId: 'alpha', skillId: 'a1', front: 'frente', back: 'verso', ...over,
});

const myQuestion = (id: string, over: Partial<Question> = {}): Question =>
  ({
    id, topicId: 'beta', skillId: 'b1', difficulty: 2, type: 'true_false', statement: 'Afirmação', correct: true,
    explanation: '', ...over,
  }) as Question;

const withQuestions = (s: UserState, n: number) =>
  Array.from({ length: n }, (_, i) => myQuestion(`mq-${i}`)).reduce(saveCustomQuestion, s);

describe('conteúdo da pessoa', () => {
  it('salvar com o mesmo id edita no lugar', () => {
    let s = saveCustomFlashcard(fresh(), myCard('c1'));
    s = saveCustomFlashcard(s, myCard('c2'));
    s = saveCustomFlashcard(s, myCard('c1', { front: 'nova' }));
    expect(s.custom.flashcards.map((c) => [c.id, c.front])).toEqual([['c1', 'nova'], ['c2', 'frente']]);
  });

  it('apagar cartão leva junto o agendamento de revisão', () => {
    const s = saveCustomFlashcard(fresh(), myCard('c1'));
    s.cards.c1 = { box: 2, dueAt: T0, reviews: 3, lapses: 0, lastAt: T0 };
    const after = deleteCustomFlashcard(s, 'c1');
    expect(after.custom.flashcards).toEqual([]);
    expect(after.cards).toEqual({});
  });

  it('apagar questão leva junto o erro pendente, mas não as tentativas', () => {
    const s = saveCustomQuestion(fresh(), myQuestion('q1'));
    s.mistakes.q1 = { questionId: 'q1', topicId: 'beta', skillId: 'b1', count: 1, lastWrongAt: T0, resolved: false };
    s.attempts.push({
      questionId: 'q1', topicId: 'beta', skillId: 'b1', answer: false, correct: false, difficulty: 2,
      context: 'mission', at: T0, durationMs: 1000,
    });
    const after = deleteCustomQuestion(s, 'q1');
    expect(after.custom.questions).toEqual([]);
    expect(after.mistakes).toEqual({});
    expect(after.attempts).toHaveLength(1);
  });

  it('não apaga questão que está na missão em andamento', () => {
    const s = withQuestions(fresh(), 2);
    const ext = extendCatalog(catalog, s.custom);
    const running = startSession(s, buildCustomMission('beta', s, ext), T0);
    const [inMission] = questionIdsOf(running.activeSession!.mission);
    expect(() => deleteCustomQuestion(running, inMission!)).toThrow(/missão em andamento/);
  });
});

describe('extendCatalog', () => {
  it('sem conteúdo da pessoa devolve o mesmo catálogo', () => {
    expect(extendCatalog(catalog, fresh().custom)).toBe(catalog);
  });

  it('cartões da pessoa vêm antes; questões entram no assunto', () => {
    const s = saveCustomQuestion(saveCustomFlashcard(fresh(), myCard('c1')), myQuestion('q1'));
    const ext = extendCatalog(catalog, s.custom);
    expect(ext.flashcardsByTopic.get('alpha')![0]!.id).toBe('c1');
    expect(ext.flashcards[0]!.id).toBe('c1');
    expect(ext.questionsByTopic.get('beta')!.map((q) => q.id)).toContain('q1');
  });

  it('deixa de fora item inválido ou corrompido em vez de quebrar', () => {
    const custom = {
      flashcards: [myCard('sem-skill', { skillId: 'x' }), myCard('vazio', { back: ' ' }), myCard('id-do-app', { id: 'alpha-f1' })],
      questions: [
        myQuestion('em-breve', { topicId: 'soon', skillId: 'x' }),
        myQuestion('gabarito', { type: 'multiple_choice', alternatives: [{ id: 'A', text: 'a' }, { id: 'B', text: 'b' }], correct: 'C' } as Partial<Question>),
        { id: 'lixo', topicId: 'beta', skillId: 'b1', type: 'multiple_choice', statement: 'x' } as unknown as Question,
        myQuestion('ok'),
      ],
    };
    const ext = extendCatalog(catalog, custom);
    expect(ext.flashcards).toHaveLength(catalog.flashcards.length);
    expect(ext.questions.length - catalog.questions.length).toBe(1);
    expect(ext.questionById.has('ok')).toBe(true);
  });
});

describe('missões com questões da pessoa', () => {
  it('"Minhas questões" usa só as questões da pessoa, até o limite', () => {
    const s = withQuestions(fresh(), CUSTOM_MISSION_SIZE + 2);
    const m = buildCustomMission('beta', s, extendCatalog(catalog, s.custom));
    const ids = questionIdsOf(m);
    expect(ids).toHaveLength(CUSTOM_MISSION_SIZE);
    expect(ids.every((id) => id.startsWith('mq-'))).toBe(true);
  });

  it('sem questões da pessoa no assunto, não monta missão vazia', () => {
    expect(() => buildCustomMission('beta', fresh(), catalog)).toThrow(/Nenhuma questão sua/);
  });

  it('erro de questão que saiu do catálogo não volta na revisão', () => {
    const s = fresh();
    s.mistakes.apagada = { questionId: 'apagada', topicId: 'beta', skillId: 'b1', count: 3, lastWrongAt: T0, resolved: false };
    const m = buildMission('review', 'beta', s, catalog);
    expect(questionIdsOf(m)).not.toContain('apagada');
  });
});
