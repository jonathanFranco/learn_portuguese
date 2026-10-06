import type { Catalog } from '../../../domain/types';
import { useCatalog } from '../../store';
import styles from './Custom.module.css';

export interface TopicSkill {
  topicId: string;
  skillId: string;
}

/** Assunto pedido (`?assunto=`) ou o primeiro com conteúdo, com a primeira regra dele. */
export function initialTopicSkill(catalog: Catalog, topicId?: string | null): TopicSkill {
  const topics = catalog.topics.filter((t) => t.available);
  const topic = topics.find((t) => t.id === topicId) ?? topics[0];
  return { topicId: topic?.id ?? '', skillId: topic?.skills[0]?.id ?? '' };
}

/** Assunto + regra (skill) do item: decide em que missões, baralhos e estatísticas ele entra. */
export function TopicSkillFields({ value, onChange }: { value: TopicSkill; onChange(value: TopicSkill): void }) {
  const catalog = useCatalog();
  const topics = catalog.topics.filter((t) => t.available);
  const skills = catalog.topicById.get(value.topicId)?.skills ?? [];
  return (
    <div className={styles.pair}>
      <div className={styles.field}>
        <label htmlFor="item-topic">Assunto</label>
        <select
          id="item-topic"
          className={styles.input}
          value={value.topicId}
          onChange={(e) => onChange(initialTopicSkill(catalog, e.target.value))}
        >
          {topics.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="item-skill">Regra</label>
        <select
          id="item-skill"
          className={styles.input}
          value={value.skillId}
          onChange={(e) => onChange({ ...value, skillId: e.target.value })}
        >
          {skills.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
