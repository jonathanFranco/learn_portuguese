import styles from './Segmented.module.css';

interface SegmentedProps<T extends string> {
  name: string;
  options: readonly (readonly [NoInfer<T>, string])[];
  value: T;
  onChange(value: NoInfer<T>): void;
}

/** Escolha única em pílulas (radios nativos: teclado e leitor de tela de graça). */
export function Segmented<T extends string>({ name, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className={styles.segmented}>
      {options.map(([option, label]) => (
        <label key={option} className={value === option ? styles.on : undefined}>
          <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} />
          {label}
        </label>
      ))}
    </div>
  );
}
