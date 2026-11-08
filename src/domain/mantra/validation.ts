/** Regole di validazione dei mantra e delle categorie (DOMAIN R1, R9). Pure, senza dipendenze. */
export const MAX_MANTRA_LENGTH = 140;
export const MAX_CATEGORY_NAME_LENGTH = 60;
export const MAX_CATEGORY_DEPTH = 2;

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function validateMantraText(raw: string): ValidationResult<string> {
  const text = raw.trim().replace(/\s+/g, " ");
  if (text.length === 0) return { ok: false, error: "EMPTY" };
  if (text.length > MAX_MANTRA_LENGTH) return { ok: false, error: "TOO_LONG" };
  return { ok: true, value: text };
}

export function validateCategoryName(raw: string): ValidationResult<string> {
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length === 0) return { ok: false, error: "EMPTY" };
  if (name.length > MAX_CATEGORY_NAME_LENGTH) return { ok: false, error: "TOO_LONG" };
  return { ok: true, value: name };
}

/** depth del genitore: 0 = nessun genitore (radice). Una categoria figlia ha depth genitore + 1. */
export function canAddChild(parentDepth: number): boolean {
  return parentDepth + 1 < MAX_CATEGORY_DEPTH;
}
