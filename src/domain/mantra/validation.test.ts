import { describe, expect, it } from "vitest";
import {
  canAddChild,
  MAX_MANTRA_LENGTH,
  validateCategoryName,
  validateMantraText,
} from "./validation";

describe("validateMantraText (R1)", () => {
  it("accetta e normalizza gli spazi", () => {
    expect(validateMantraText("  Guarda   la palla ")).toEqual({
      ok: true,
      value: "Guarda la palla",
    });
  });
  it("rifiuta testo vuoto o solo spazi", () => {
    expect(validateMantraText("   ")).toEqual({ ok: false, error: "EMPTY" });
  });
  it("rifiuta oltre il limite, accetta esattamente il limite", () => {
    expect(validateMantraText("a".repeat(MAX_MANTRA_LENGTH)).ok).toBe(true);
    expect(validateMantraText("a".repeat(MAX_MANTRA_LENGTH + 1))).toEqual({
      ok: false,
      error: "TOO_LONG",
    });
  });
});

describe("validateCategoryName", () => {
  it("normalizza e rifiuta vuoto", () => {
    expect(validateCategoryName(" Sport ")).toEqual({ ok: true, value: "Sport" });
    expect(validateCategoryName("")).toEqual({ ok: false, error: "EMPTY" });
  });
});

describe("canAddChild (R9)", () => {
  it("permette Sport › Tennis ma non un terzo livello", () => {
    expect(canAddChild(0)).toBe(true);
    expect(canAddChild(1)).toBe(false);
  });
});
