/**
 * ESEMPIO di logica di business pura (nessuna dipendenza da DB/UI/framework).
 * Regola: lo sconto percentuale non può superare il 30% del subtotale.
 * Tutti gli importi sono interi in centesimi.
 */
export const MAX_DISCOUNT_PERCENT = 30;

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  total: number;
}

export function computeOrderTotal(subtotalCents: number, discountPercent: number): PriceBreakdown {
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0) {
    throw new RangeError("subtotal must be a non-negative integer (cents)");
  }
  if (!Number.isFinite(discountPercent) || discountPercent < 0) {
    throw new RangeError("discountPercent must be >= 0");
  }
  const effective = Math.min(discountPercent, MAX_DISCOUNT_PERCENT);
  const discount = Math.round((subtotalCents * effective) / 100);
  return { subtotal: subtotalCents, discount, total: subtotalCents - discount };
}
