import { describe, expect, it } from "vitest";
import { computeOrderTotal, MAX_DISCOUNT_PERCENT } from "./pricing";

describe("computeOrderTotal", () => {
  it("applica lo sconto richiesto", () => {
    expect(computeOrderTotal(10_000, 10)).toEqual({
      subtotal: 10_000,
      discount: 1_000,
      total: 9_000,
    });
  });

  it("senza sconto il totale è il subtotale", () => {
    expect(computeOrderTotal(5_000, 0).total).toBe(5_000);
  });

  it(`limita lo sconto al ${MAX_DISCOUNT_PERCENT}%`, () => {
    expect(computeOrderTotal(10_000, 90)).toEqual({
      subtotal: 10_000,
      discount: 3_000,
      total: 7_000,
    });
  });

  it("arrotonda al centesimo e mantiene total + discount = subtotal", () => {
    const r = computeOrderTotal(999, 15);
    expect(r.discount + r.total).toBe(r.subtotal);
    expect(Number.isInteger(r.discount)).toBe(true);
  });

  it("rifiuta input non validi", () => {
    expect(() => computeOrderTotal(-1, 0)).toThrow(RangeError);
    expect(() => computeOrderTotal(10.5, 0)).toThrow(RangeError);
    expect(() => computeOrderTotal(100, -5)).toThrow(RangeError);
    expect(() => computeOrderTotal(100, NaN)).toThrow(RangeError);
  });
});
