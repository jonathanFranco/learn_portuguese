import type { Cloud } from '../app/sync';

/**
 * Um documento por pessoa: `users/{uid}` = { state (JSON), savedAt }. Regras em firestore.rules.
 * Sem config no .env.local → null (app só local). O SDK carrega à parte, sem atrasar a primeira tela.
 */
export function createFirebaseCloud(): Cloud | null {
  const env = import.meta.env;
  if (!env.VITE_FIREBASE_API_KEY || !env.VITE_FIREBASE_PROJECT_ID) return null;

  const sdk = Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/firestore')]).then(
    ([{ initializeApp }, authSdk, fs]) => {
      const app = initializeApp({
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        appId: env.VITE_FIREBASE_APP_ID,
      });
      const db = fs.getFirestore(app);
      return { authSdk, auth: authSdk.getAuth(app), fs, ref: (uid: string) => fs.doc(db, 'users', uid) };
    },
  );

  return {
    watch(onChange) {
      void sdk.then(({ authSdk, auth }) =>
        authSdk.onAuthStateChanged(auth, (u) => onChange(u && { uid: u.uid, email: u.email, name: u.displayName })),
      );
    },
    async signIn() {
      const { authSdk, auth } = await sdk;
      try {
        await authSdk.signInWithPopup(auth, new authSdk.GoogleAuthProvider());
      } catch (e) {
        // Fechar a janela do Google não é erro.
        const code = (e as { code?: string }).code;
        if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') throw e;
      }
    },
    async signOut() {
      const { authSdk, auth } = await sdk;
      await authSdk.signOut(auth);
    },
    async load(uid) {
      const { fs, ref } = await sdk;
      const snap = await fs.getDoc(ref(uid));
      if (!snap.exists()) return null;
      const { state, savedAt } = snap.data();
      if (typeof state !== 'string' || typeof savedAt !== 'number') throw new Error('Cópia na nuvem com formato inválido.');
      return { json: state, savedAt };
    },
    async save(uid, { json, savedAt }) {
      const { fs, ref } = await sdk;
      // JSON como texto: o Firestore não aceita undefined nem arrays aninhados.
      await fs.setDoc(ref(uid), { state: json, savedAt });
    },
  };
}
