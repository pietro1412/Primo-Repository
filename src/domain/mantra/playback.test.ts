import { describe, expect, it } from "vitest";
import { nextIndex } from "./playlist";
import {
  canStartPhrase,
  estimatePlays,
  normalizePlays,
  parseLocalDay,
  validateSessionConfig,
} from "./session";
import { STYLE_PARAMS, VOICE_STYLES, isVoiceStyle } from "./styles";

describe("nextIndex (R3)", () => {
  it("con un solo mantra restituisce sempre 0", () => {
    expect(nextIndex(0, 1)).toBe(0);
    expect(nextIndex(null, 1)).toBe(0);
  });
  it("non ripete mai l'indice precedente, per ogni valore di random", () => {
    for (const len of [2, 3, 5]) {
      for (let prev = 0; prev < len; prev++) {
        for (let r = 0; r < 1; r += 0.05) {
          const n = nextIndex(prev, len, () => r);
          expect(n).not.toBe(prev);
          expect(n).toBeGreaterThanOrEqual(0);
          expect(n).toBeLessThan(len);
        }
      }
    }
  });
  it("copre tutti gli altri indici", () => {
    const seen = new Set<number>();
    for (let r = 0; r < 1; r += 0.01) seen.add(nextIndex(1, 4, () => r));
    expect([...seen].sort()).toEqual([0, 2, 3]);
  });
  it("primo mantra: indice valido, anche con random vicino a 1", () => {
    expect(nextIndex(null, 3, () => 0.999999)).toBe(2);
  });
  it("lista vuota è un errore", () => {
    expect(() => nextIndex(null, 0)).toThrow(RangeError);
  });
});

describe("validateSessionConfig (R2)", () => {
  it("accetta i limiti", () => {
    expect(validateSessionConfig(1, 0)).toBeNull();
    expect(validateSessionConfig(120, 60)).toBeNull();
  });
  it("rifiuta fuori limite o non interi", () => {
    expect(validateSessionConfig(0, 5)).toBe("INVALID_MINUTES");
    expect(validateSessionConfig(121, 5)).toBe("INVALID_MINUTES");
    expect(validateSessionConfig(1.5, 5)).toBe("INVALID_MINUTES");
    expect(validateSessionConfig(10, -1)).toBe("INVALID_PAUSE");
    expect(validateSessionConfig(10, 61)).toBe("INVALID_PAUSE");
  });
});

describe("canStartPhrase (R4)", () => {
  it("vale fino a un istante prima della durata", () => {
    expect(canStartPhrase(59_999, 1)).toBe(true);
    expect(canStartPhrase(60_000, 1)).toBe(false);
  });
  it("estimatePlays: 1 min, frase 3 s + pausa 2 s → 12", () => {
    expect(estimatePlays(1, 3, 2)).toBe(12);
  });
});

describe("parseLocalDay (R6)", () => {
  it("accetta date reali, rifiuta formati e date impossibili", () => {
    expect(parseLocalDay("2026-11-08")).toBe("2026-11-08");
    expect(parseLocalDay("2026-02-30")).toBeNull();
    expect(parseLocalDay("08/11/2026")).toBeNull();
  });
});

describe("normalizePlays", () => {
  it("somma i duplicati", () => {
    expect(
      normalizePlays([
        { mantraId: "a", count: 2 },
        { mantraId: "a", count: 3 },
      ]),
    ).toEqual([{ mantraId: "a", count: 5 }]);
  });
  it("rifiuta conteggi non validi e blocchi vuoti", () => {
    expect(normalizePlays([])).toBeNull();
    expect(normalizePlays([{ mantraId: "a", count: 0 }])).toBeNull();
    expect(normalizePlays([{ mantraId: "a", count: 1.5 }])).toBeNull();
    expect(normalizePlays([{ mantraId: "a", count: 1001 }])).toBeNull();
    expect(normalizePlays([{ mantraId: "", count: 1 }])).toBeNull();
  });
});

describe("stili", () => {
  it("ogni stile ha parametri in range e il sussurro è il più basso", () => {
    for (const s of VOICE_STYLES) {
      const p = STYLE_PARAMS[s];
      expect(p.rate).toBeGreaterThan(0);
      expect(p.pitch).toBeGreaterThanOrEqual(0);
      expect(p.pitch).toBeLessThanOrEqual(2);
      expect(p.volume).toBeGreaterThan(0);
      expect(p.volume).toBeLessThanOrEqual(1);
    }
    expect(STYLE_PARAMS.WHISPER.volume).toBeLessThan(STYLE_PARAMS.CALM.volume);
    expect(isVoiceStyle("SHOUT")).toBe(true);
    expect(isVoiceStyle("nope")).toBe(false);
  });
});
