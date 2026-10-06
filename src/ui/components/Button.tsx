import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  block?: boolean;
}

export function Button({ variant = 'primary', size = 'md', block, className, type = 'button', ...rest }: ButtonProps) {
  const cls = [styles.button, styles[variant], styles[size], block && styles.block, className]
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={cls} {...rest} />;
}
