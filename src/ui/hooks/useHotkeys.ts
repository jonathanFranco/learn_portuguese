import { useEffect, useRef } from 'react';

/**
 * Atalhos globais de teclado. Chaves de uma letra são normalizadas para maiúscula ("a" → "A").
 * Ignora campos de texto; Enter num botão comum fica com o comportamento nativo (clique).
 */
export function useHotkeys(handlers: Record<string, () => void>, enabled = true) {
  const ref = useRef(handlers);
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      // Diálogo aberto (pausa, sheet): a tela de trás não responde.
      if (document.querySelector('dialog[open]')) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'Enter' && target?.closest('a, button:not([data-choice])')) return;
      const handler = ref.current[e.key.length === 1 ? e.key.toUpperCase() : e.key];
      if (!handler) return;
      e.preventDefault();
      handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
