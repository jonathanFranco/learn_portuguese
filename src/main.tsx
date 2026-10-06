import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './ui/design';
import { App } from './ui/App';
import { appStore } from './ui/store';
import { applyTheme } from './ui/theme';

applyTheme();

void appStore.getState().init();
// Voltar ao app (outra aba, outro aparelho usado no meio-tempo): confere a nuvem.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') void appStore.getState().sync();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
