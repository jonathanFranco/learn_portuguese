import type { Catalog, CustomContent, Flashcard, Lesson, Phase, Question, Topic } from '../domain/types';

export function buildCatalog(
  phases: Phase[],
  topics: Topic[],
  lessons: Lesson[],
  questions: Question[],
  flashcards: Flashcard[] = [],
): Catalog {
  return {
    phases,
    topics,
    topicById: new Map(topics.map((t) => [t.id, t])),
    lessons,
    lessonById: new Map(lessons.map((l) => [l.id, l])),
    lessonsByTopic: groupBy(lessons, (l) => l.topicId),
    questions,
    questionById: new Map(questions.map((q) => [q.id, q])),
    questionsByTopic: groupBy(questions, (q) => q.topicId),
    flashcards,
    flashcardById: new Map(flashcards.map((c) => [c.id, c])),
    flashcardsByTopic: groupBy(flashcards, (c) => c.topicId),
  };
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const list = map.get(k);
    if (list) list.push(item);
    else map.set(k, [item]);
  }
  return map;
}

/** Erros de integridade do conteúdo (ids, referências, gabaritos). Vazio = ok. */
export function validateCatalog(catalog: Catalog): string[] {
  const errors: string[] = [];
  const dup = (kind: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) errors.push(`${kind} duplicado: ${id}`);
      seen.add(id);
    }
  };
  dup('topic', catalog.topics.map((t) => t.id));
  dup('lesson', catalog.lessons.map((l) => l.id));
  dup('question', catalog.questions.map((q) => q.id));
  dup('flashcard', catalog.flashcards.map((c) => c.id));

  const phaseIds = new Set(catalog.phases.map((p) => p.id));
  for (const t of catalog.topics) {
    if (!phaseIds.has(t.phase)) errors.push(`${t.id}: fase inexistente ${t.phase}`);
    for (const pre of t.prerequisites) {
      if (!catalog.topicById.has(pre)) errors.push(`${t.id}: pré-requisito inexistente ${pre}`);
    }
    if (!t.available) continue;
    if (t.skills.length === 0) errors.push(`${t.id}: sem skills`);
    for (const s of t.skills) {
      const qs = (catalog.questionsByTopic.get(t.id) ?? []).filter((q) => q.skillId === s.id);
      if (qs.length < 2) errors.push(`${t.id}/${s.id}: menos de 2 questões (sem questão semelhante)`);
      const cards = (catalog.flashcardsByTopic.get(t.id) ?? []).filter((c) => c.skillId === s.id);
      if (cards.length < 3) errors.push(`${t.id}/${s.id}: menos de 3 cartões`);
    }
  }

  for (const l of catalog.lessons) {
    if (!skillExists(catalog, l.topicId, l.skillId)) errors.push(`${l.id}: skill ${l.topicId}/${l.skillId} inexistente`);
    if (l.examples.length === 0) errors.push(`${l.id}: sem exemplos`);
    for (const kind of ['cobranca', 'pegadinha'] as const) {
      if (!l.tips.some((t) => t.kind === kind)) errors.push(`${l.id}: sem dica do tipo ${kind}`);
    }
  }

  for (const c of catalog.flashcards) errors.push(...flashcardErrors(c, catalog).map((e) => `${c.id}: ${e}`));

  for (const q of catalog.questions) {
    // Explicação é obrigatória só no conteúdo do app; na questão da pessoa é opcional.
    if (!q.explanation.trim()) errors.push(`${q.id}: sem explicação`);
    errors.push(...questionErrors(q, catalog).map((e) => `${q.id}: ${e}`));
  }
  return errors;
}

function skillExists(catalog: Catalog, topicId: string, skillId: string): boolean {
  return catalog.topicById.get(topicId)?.skills.some((s) => s.id === skillId) ?? false;
}

/** Problemas de um cartão (do app ou da pessoa). Vazio = ok. */
export function flashcardErrors(c: Flashcard, catalog: Catalog): string[] {
  const errs: string[] = [];
  if (!skillExists(catalog, c.topicId, c.skillId)) errs.push(`skill ${c.topicId}/${c.skillId} inexistente`);
  if (!c.front.trim() || !c.back.trim()) errs.push('frente ou verso vazio');
  return errs;
}

/** Problemas de uma questão (do app ou da pessoa). Vazio = ok. */
export function questionErrors(q: Question, catalog: Catalog): string[] {
  const errs: string[] = [];
  if (!skillExists(catalog, q.topicId, q.skillId)) errs.push(`skill ${q.topicId}/${q.skillId} inexistente`);
  if (!q.statement.trim()) errs.push('enunciado vazio');
  errs.push(...answerKeyErrors(q));
  return errs;
}

/**
 * Catálogo com o conteúdo da pessoa. Item inválido (ex.: a skill saiu do conteúdo, ou o dado veio
 * corrompido de um backup) fica de fora em vez de quebrar uma missão. Cartões da pessoa vêm antes:
 * os novos entram primeiro na revisão do dia.
 */
export function extendCatalog(base: Catalog, custom: CustomContent): Catalog {
  if (custom.flashcards.length === 0 && custom.questions.length === 0) return base;
  const valid = (errors: () => string[]) => {
    try {
      return errors().length === 0;
    } catch {
      return false;
    }
  };
  const flashcards = custom.flashcards.filter((c) => !base.flashcardById.has(c.id) && valid(() => flashcardErrors(c, base)));
  const questions = custom.questions.filter((q) => !base.questionById.has(q.id) && valid(() => questionErrors(q, base)));
  return buildCatalog(base.phases, base.topics, base.lessons, [...base.questions, ...questions], [
    ...flashcards,
    ...base.flashcards,
  ]);
}

function answerKeyErrors(q: Question): string[] {
  switch (q.type) {
    case 'multiple_choice': {
      const ids = q.alternatives.map((a) => a.id);
      const errs: string[] = [];
      if (q.alternatives.length < 2) errs.push('menos de 2 alternativas');
      if (q.alternatives.some((a) => !a.text.trim())) errs.push('alternativa sem texto');
      if (new Set(ids).size !== ids.length) errs.push('alternativas com id repetido');
      if (!ids.includes(q.correct)) errs.push(`gabarito ${q.correct} não existe`);
      return errs;
    }
    case 'true_false':
      return [];
    case 'fill_blank': {
      const errs: string[] = [];
      if (q.template.split('___').length !== 2) errs.push('template precisa de exatamente um ___');
      if (!q.options.includes(q.correct)) errs.push('gabarito fora das opções');
      return errs;
    }
    case 'identify_error':
      return q.correct >= 0 && q.correct < q.segments.length ? [] : ['índice do erro fora dos trechos'];
    case 'order': {
      const sorted = (xs: string[]) => [...xs].sort().join('|');
      return sorted(q.items) === sorted(q.correct) ? [] : ['ordem correta não usa os mesmos itens'];
    }
    case 'match':
      return q.pairs.length >= 2 ? [] : ['menos de 2 pares'];
  }
}
