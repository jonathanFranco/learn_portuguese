import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import styles from './Shell.module.css';

const TABS = [
  { to: '/', label: 'Hoje', icon: '☀️' },
  { to: '/trilha', label: 'Trilha', icon: '🧭' },
  { to: '/cartoes', label: 'Cartões', icon: '🗂️' },
  { to: '/questoes', label: 'Questões', icon: '📝' },
  { to: '/progresso', label: 'Progresso', icon: '📈' },
];

/** Telas com navegação. Modo foco e conclusão ficam fora. */
export function Shell() {
  const { pathname } = useLocation();
  const first = useRef(true);
  // Troca de aba: leva o foco ao título da tela (anuncia a página nova). Não na primeira carga.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const h1 = document.querySelector<HTMLElement>('main h1');
    h1?.setAttribute('tabindex', '-1');
    h1?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <Outlet />
      <nav className={styles.nav} aria-label="Principal">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
            <span aria-hidden>{t.icon}</span>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
