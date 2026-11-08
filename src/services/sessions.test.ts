import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createCategory } from "./categories";
import { addMantra } from "./mantras";
import { categoryTotals, endSession, recordPlays, startSession } from "./sessions";

const tag = `s${Date.now()}`;
let a: string;
let b: string;
let catId: string;
let m1: string;
let m2: string;
let otherCatMantra: string;

const cfg = (categoryId: string) => ({ categoryId, style: "CALM", minutes: 5, pauseSeconds: 3 });

beforeAll(async () => {
  a = (await prisma.user.create({ data: { email: `${tag}-a@x.test`, passwordHash: "x" } })).id;
  b = (await prisma.user.create({ data: { email: `${tag}-b@x.test`, passwordHash: "x" } })).id;
  const cat = await createCategory(a, "Tennis");
  catId = cat.id;
  m1 = (await addMantra(a, cat.id, "Guarda la palla")).id;
  m2 = (await addMantra(a, cat.id, "Alza il gomito")).id;
  const other = await createCategory(a, "Altra");
  otherCatMantra = (await addMantra(a, other.id, "Altro")).id;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { startsWith: tag } } });
  await prisma.$disconnect();
});

describe("startSession", () => {
  it("R2: rifiuta durata/pausa/stile non validi", async () => {
    await expect(startSession(a, { ...cfg(catId), minutes: 0 })).rejects.toThrow("INVALID_MINUTES");
    await expect(startSession(a, { ...cfg(catId), pauseSeconds: 61 })).rejects.toThrow(
      "INVALID_PAUSE",
    );
    await expect(startSession(a, { ...cfg(catId), style: "LOUD" })).rejects.toThrow(
      "INVALID_STYLE",
    );
  });
  it("R7: categoria di un altro utente → NOT_FOUND", async () => {
    await expect(startSession(b, cfg(catId))).rejects.toThrow("NOT_FOUND");
  });
  it("categoria senza mantra → NO_MANTRAS", async () => {
    const empty = await createCategory(a, "Vuota");
    await expect(startSession(a, cfg(empty.id))).rejects.toThrow("NO_MANTRAS");
  });
});

describe("recordPlays", () => {
  it("R6: aggrega per mantra e giorno, sessione e totali coerenti", async () => {
    const s = await startSession(a, cfg(catId));
    await recordPlays(a, s.id, "2026-11-08", [{ mantraId: m1, count: 3 }]);
    await recordPlays(a, s.id, "2026-11-08", [
      { mantraId: m1, count: 2 },
      { mantraId: m2, count: 1 },
    ]);
    await recordPlays(a, s.id, "2026-11-09", [{ mantraId: m1, count: 4 }]);

    const rows = await prisma.mantraPlayCount.findMany({ where: { userId: a, mantraId: m1 } });
    const byDay = Object.fromEntries(rows.map((r) => [r.day.toISOString().slice(0, 10), r.count]));
    expect(byDay).toEqual({ "2026-11-08": 5, "2026-11-09": 4 });

    expect((await prisma.playbackSession.findUnique({ where: { id: s.id } }))?.totalPlays).toBe(10);
    expect(await categoryTotals(a, catId, "2026-11-08")).toEqual({ total: 10, today: 6 });
  });

  it("rifiuta mantra di un'altra categoria, conteggi e giorni non validi", async () => {
    const s = await startSession(a, cfg(catId));
    await expect(
      recordPlays(a, s.id, "2026-11-08", [{ mantraId: otherCatMantra, count: 1 }]),
    ).rejects.toThrow("INVALID_PLAYS");
    await expect(recordPlays(a, s.id, "2026-11-08", [{ mantraId: m1, count: 0 }])).rejects.toThrow(
      "INVALID_PLAYS",
    );
    await expect(recordPlays(a, s.id, "2026-02-30", [{ mantraId: m1, count: 1 }])).rejects.toThrow(
      "INVALID_PLAYS",
    );
  });

  it("R7: un altro utente non può registrare su una sessione altrui", async () => {
    const s = await startSession(a, cfg(catId));
    await expect(recordPlays(b, s.id, "2026-11-08", [{ mantraId: m1, count: 1 }])).rejects.toThrow(
      "NOT_FOUND",
    );
  });

  it("sessione conclusa: non accetta altri conteggi", async () => {
    const s = await startSession(a, cfg(catId));
    await endSession(a, s.id);
    await expect(recordPlays(a, s.id, "2026-11-08", [{ mantraId: m1, count: 1 }])).rejects.toThrow(
      "SESSION_ENDED",
    );
  });
});
