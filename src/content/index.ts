import type { Flashcard, Lesson, Question } from '../domain/types';
import { buildCatalog, validateCatalog } from './catalog';
import { phases, topics } from './topics';

interface TopicModule {
  lessons: Lesson[];
  questions: Question[];
  flashcards: Flashcard[];
}

/** Conteúdo de cada assunto: `topics/<id do assunto>.ts`. Arquivo presente = assunto disponível. */
const files = import.meta.glob<TopicModule>('./topics/*.ts', { eager: true });
const modules = new Map(Object.entries(files).map(([path, m]) => [path.slice('./topics/'.length, -'.ts'.length), m]));

// Na ordem da trilha: os cartões novos seguem essa ordem.
const ordered = topics.flatMap((t) => modules.get(t.id) ?? []);

export const catalog = buildCatalog(
  phases,
  topics.map((t) => ({ ...t, available: modules.has(t.id) })),
  ordered.flatMap((m) => m.lessons),
  ordered.flatMap((m) => m.questions),
  ordered.flatMap((m) => m.flashcards),
);

// Conteúdo quebrado deve falhar alto em desenvolvimento, não no meio de uma missão.
if (import.meta.env.DEV) {
  const unknown = [...modules.keys()].filter((id) => !catalog.topicById.has(id));
  const errors = [...unknown.map((id) => `topics/${id}.ts: assunto fora da trilha`), ...validateCatalog(catalog)];
  if (errors.length > 0) console.error('Conteúdo inválido:\n' + errors.join('\n'));
}
