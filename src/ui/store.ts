import { useStore } from 'zustand';
import { createAppStore, type AppActions, type AppState } from '../app/store';
import { catalog } from '../content';
import { createFirebaseCloud } from '../persistence/firebase';
import { LocalStorageRepository } from '../persistence/repository';

export const appStore = createAppStore(new LocalStorageRepository(), catalog, Date.now, createFirebaseCloud());

export function useApp<T>(selector: (s: AppState & AppActions) => T): T {
  return useStore(appStore, selector);
}

/** Ações são estáveis: usar direto em handlers, sem assinar a store. */
export const actions = (): AppActions => appStore.getState();

/** Catálogo com o conteúdo da pessoa. Telas usam este, nunca o de `content/` direto. */
export function useCatalog() {
  return useApp((s) => s.catalog());
}
