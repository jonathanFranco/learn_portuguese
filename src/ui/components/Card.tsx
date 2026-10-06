import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLElement> {
  tone?: 'plain' | 'brand' | 'accent';
  as?: 'section' | 'div' | 'article';
}

export function Card({ tone = 'plain', as: Tag = 'section', className, ...rest }: CardProps) {
  return <Tag className={[styles.card, styles[tone], className].filter(Boolean).join(' ')} {...rest} />;
}
