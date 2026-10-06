import { useEffect, useRef, type ReactNode } from 'react';
import styles from './Sheet.module.css';

interface SheetProps {
  open: boolean;
  onClose(): void;
  title: string;
  /** center = diálogo no meio (pausa); bottom = bottom sheet. */
  placement?: 'bottom' | 'center';
  children: ReactNode;
}

/** Diálogo sobre <dialog> nativo: foco preso, Esc fecha, fundo inerte. */
export function Sheet({ open, onClose, title, placement = 'bottom', children }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`${styles.sheet} ${styles[placement]}`}
      aria-label={title}
      // Fechar pelo `open` (programático) não é ação do usuário: não chama onClose.
      onClose={() => open && onClose()}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className={styles.body}>
        {placement === 'bottom' && <div className={styles.grip} aria-hidden />}
        {children}
      </div>
    </dialog>
  );
}
