import { describe, expect, it } from 'vitest';
import { planSync } from './sync';

describe('planSync', () => {
  const base = { hasLocal: true, savedAt: 10, syncedAt: 10 };

  it('nuvem vazia: envia o local (ou nada, se não há local)', () => {
    expect(planSync({ ...base, remote: null })).toBe('push');
    expect(planSync({ ...base, hasLocal: false, remote: null })).toBe('none');
  });

  it('aparelho novo: baixa da nuvem', () => {
    expect(planSync({ hasLocal: false, savedAt: 0, syncedAt: 0, remote: { savedAt: 5 } })).toBe('pull');
  });

  it('só um lado mudou desde a última sincronização', () => {
    expect(planSync({ ...base, remote: { savedAt: 10 } })).toBe('none');
    expect(planSync({ ...base, savedAt: 20, remote: { savedAt: 10 } })).toBe('push');
    expect(planSync({ ...base, remote: { savedAt: 30 } })).toBe('pull');
  });

  it('os dois mudaram: conflito — inclusive no primeiro login com progresso dos dois lados', () => {
    expect(planSync({ ...base, savedAt: 20, remote: { savedAt: 30 } })).toBe('conflict');
    expect(planSync({ hasLocal: true, savedAt: 20, syncedAt: 0, remote: { savedAt: 30 } })).toBe('conflict');
  });

  it('envio confirmado mas não registrado: mesma versão, nada a fazer', () => {
    expect(planSync({ ...base, savedAt: 20, remote: { savedAt: 20 } })).toBe('none');
  });
});
