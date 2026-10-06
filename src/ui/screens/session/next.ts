import { actions } from '../../store';

/** Avança o passo. Ao concluir a missão, a tela de sessão redireciona para a conclusão. */
export function next() {
  actions().next();
  window.scrollTo({ top: 0 });
}
