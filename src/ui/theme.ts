/** Preferência de tema do aparelho (não faz parte do progresso: não vai no export). */
export type ThemePref = 'auto' | 'light' | 'dark';

const KEY = 'passo:theme';
const dark = window.matchMedia('(prefers-color-scheme: dark)');

export function getThemePref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

export function setThemePref(pref: ThemePref) {
  try {
    if (pref === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    // Sem storage: vale só nesta visita.
  }
  applyTheme(pref);
}

/** data-theme no <html> (tokens.css reage) + cor da barra do navegador. */
export function applyTheme(pref: ThemePref = getThemePref()) {
  const root = document.documentElement;
  if (pref === 'auto') root.removeAttribute('data-theme');
  else root.dataset.theme = pref;
  const bg = getComputedStyle(root).getPropertyValue('--bg').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
}

// No modo automático, acompanha a troca de tema do sistema.
dark.addEventListener('change', () => getThemePref() === 'auto' && applyTheme('auto'));
