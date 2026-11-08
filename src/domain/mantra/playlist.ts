/**
 * Scelta del prossimo mantra (DOMAIN R3): mai lo stesso due volte di fila se ce ne sono ≥ 2.
 * `random` deve restituire un numero in [0, 1) (iniettabile per i test).
 */
export function nextIndex(
  previous: number | null,
  length: number,
  random: () => number = Math.random,
): number {
  if (length <= 0) throw new RangeError("length must be > 0");
  if (length === 1) return 0;
  if (previous === null || previous < 0 || previous >= length) {
    return Math.min(length - 1, Math.floor(random() * length));
  }
  // Sceglie tra gli altri length-1 indici ed evita di riselezionare `previous`.
  const pick = Math.min(length - 2, Math.floor(random() * (length - 1)));
  return pick >= previous ? pick + 1 : pick;
}
