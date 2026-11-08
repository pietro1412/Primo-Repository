export const MIN_MINUTES = 1;
export const MAX_MINUTES = 120;
export const MIN_PAUSE_SECONDS = 0;
export const MAX_PAUSE_SECONDS = 60;

export interface SessionConfig {
  minutes: number;
  pauseSeconds: number;
}

/** DOMAIN R2: durata intera 1–120 min, pausa intera 0–60 s. */
export function validateSessionConfig(minutes: number, pauseSeconds: number): string | null {
  if (!Number.isInteger(minutes) || minutes < MIN_MINUTES || minutes > MAX_MINUTES) {
    return "INVALID_MINUTES";
  }
  if (
    !Number.isInteger(pauseSeconds) ||
    pauseSeconds < MIN_PAUSE_SECONDS ||
    pauseSeconds > MAX_PAUSE_SECONDS
  ) {
    return "INVALID_PAUSE";
  }
  return null;
}

/** DOMAIN R4: non si inizia una nuova frase quando il tempo trascorso ha raggiunto la durata. */
export function canStartPhrase(elapsedMs: number, minutes: number): boolean {
  return elapsedMs < minutes * 60_000;
}

/** Stima del numero massimo di frasi iniziate (per anteprima in UI). */
export function estimatePlays(minutes: number, avgPhraseSeconds: number, pauseSeconds: number) {
  const cycle = avgPhraseSeconds + pauseSeconds;
  if (cycle <= 0) return 0;
  return Math.ceil((minutes * 60) / cycle);
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** DOMAIN R6: giorno locale dell'utente in formato YYYY-MM-DD (data reale, non solo formato). */
export function parseLocalDay(value: string): string | null {
  if (!DAY_RE.test(value)) return null;
  const d = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value ? null : value;
}

/** Normalizza e valida un blocco di riproduzioni (R5/R6): ID unici, conteggi interi 1–1000. */
export function normalizePlays(
  plays: { mantraId: string; count: number }[],
): { mantraId: string; count: number }[] | null {
  const merged = new Map<string, number>();
  for (const p of plays) {
    if (!p.mantraId || !Number.isInteger(p.count) || p.count < 1 || p.count > 1000) return null;
    merged.set(p.mantraId, (merged.get(p.mantraId) ?? 0) + p.count);
  }
  if (merged.size === 0 || merged.size > 200) return null;
  return [...merged].map(([mantraId, count]) => ({ mantraId, count }));
}
