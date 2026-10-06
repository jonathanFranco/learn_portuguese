import { useState } from 'react';
import type { Catalog } from '../../../domain/types';
import { Button } from '../../components/Button';
import { ExampleView } from '../../components/ExampleView';
import { RichText } from '../../components/RichText';
import { TipList } from '../../components/TipList';
import { useCatalog } from '../../store';
import { next } from './next';
import { StepActions } from './StepActions';
import styles from './Session.module.css';

function lessonOf(catalog: Catalog, id: string) {
  const lesson = catalog.lessonById.get(id);
  if (!lesson) throw new Error(`Lição desconhecida: ${id}`);
  return lesson;
}

/** Teoria curta com progressive disclosure: resumo → exemplo → dicas de prova → aprofundar. */
export function LessonStep({ lessonId }: { lessonId: string }) {
  const lesson = lessonOf(useCatalog(), lessonId);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [deep, setDeep] = useState(false);
  const example = lesson.examples[exampleIndex];
  const hasMore = lesson.examples.length > 1;

  return (
    <>
      <article className={styles.step}>
        <p className={styles.eyebrow}>Regra</p>
        <h1 className={styles.title}>{lesson.title}</h1>
        <RichText className={styles.lead} text={lesson.summary} />
        {example && <ExampleView key={exampleIndex} example={example} />}
        <div className={styles.row}>
          {hasMore && (
            <Button variant="secondary" onClick={() => setExampleIndex((i) => (i + 1) % lesson.examples.length)}>
              Mostrar outro exemplo
            </Button>
          )}
          {lesson.deepDive && !deep && (
            <Button variant="ghost" onClick={() => setDeep(true)}>
              Saber mais
            </Button>
          )}
        </div>
        {deep && lesson.deepDive && (
          <div className={styles.deep}>
            <RichText text={lesson.deepDive} />
          </div>
        )}
        <TipList tips={lesson.tips} />
      </article>
      <StepActions onPrimary={next}>
        <Button size="lg" block onClick={next}>Entendi</Button>
      </StepActions>
    </>
  );
}

export function ExampleStep({ lessonId, exampleIndex }: { lessonId: string; exampleIndex: number }) {
  const lesson = lessonOf(useCatalog(), lessonId);
  const example = lesson.examples[exampleIndex] ?? lesson.examples[0];
  return (
    <>
      <article className={styles.step}>
        <p className={styles.eyebrow}>Mais um exemplo · {lesson.title}</p>
        {example && <ExampleView example={example} />}
      </article>
      <StepActions onPrimary={next}>
        <Button size="lg" block onClick={next}>Continuar</Button>
      </StepActions>
    </>
  );
}
