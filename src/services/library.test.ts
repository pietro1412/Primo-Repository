import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createCategory, getOwnedCategory, listUserTree } from "./categories";
import { addMantra, deleteMantra } from "./mantras";
import { copyFromCatalog, createCatalogCategory, addCatalogMantra } from "./catalog";

// Test di integrazione su DB reale (DATABASE_URL). Dati con prefisso unico, ripuliti a fine test.
const tag = `t${Date.now()}`;
let a: string;
let b: string;
const catalogIds: string[] = [];

beforeAll(async () => {
  a = (await prisma.user.create({ data: { email: `${tag}-a@x.test`, passwordHash: "x" } })).id;
  b = (await prisma.user.create({ data: { email: `${tag}-b@x.test`, passwordHash: "x" } })).id;
});

afterAll(async () => {
  await prisma.category.deleteMany({ where: { id: { in: catalogIds } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: tag } } });
  await prisma.$disconnect();
});

describe("libreria privata", () => {
  it("R7: un altro utente non vede né modifica categorie e mantra", async () => {
    const cat = await createCategory(a, "Sport");
    const m = await addMantra(a, cat.id, "Guarda la palla");
    expect(await listUserTree(b)).toEqual([]);
    await expect(getOwnedCategory(b, cat.id)).rejects.toThrow("NOT_FOUND");
    await expect(addMantra(b, cat.id, "intruso")).rejects.toThrow("NOT_FOUND");
    await expect(deleteMantra(b, m.id)).rejects.toThrow("NOT_FOUND");
    expect((await getOwnedCategory(a, cat.id)).mantras).toHaveLength(1);
  });

  it("R1: testo vuoto o troppo lungo rifiutato", async () => {
    const cat = await createCategory(a, "Studio");
    await expect(addMantra(a, cat.id, "   ")).rejects.toThrow("EMPTY");
    await expect(addMantra(a, cat.id, "x".repeat(141))).rejects.toThrow("TOO_LONG");
  });

  it("R9: massimo due livelli", async () => {
    const root = await createCategory(a, "Livelli");
    const child = await createCategory(a, "Figlio", root.id);
    await expect(createCategory(a, "Nipote", child.id)).rejects.toThrow("TOO_DEEP");
  });

  it("posizioni dei mantra progressive", async () => {
    const cat = await createCategory(a, "Ordine");
    await addMantra(a, cat.id, "uno");
    await addMantra(a, cat.id, "due");
    const { mantras } = await getOwnedCategory(a, cat.id);
    expect(mantras.map((x) => x.position)).toEqual([0, 1]);
  });
});

describe("catalogo", () => {
  it("R8: la copia è privata e indipendente dal catalogo", async () => {
    const root = await createCatalogCategory(`${tag}-Sport`);
    const tennis = await createCatalogCategory(`${tag}-Tennis`, root.id);
    catalogIds.push(root.id);
    await addCatalogMantra(tennis.id, "Gira le spalle");

    const copy = await copyFromCatalog(b, tennis.id);
    const mine = await getOwnedCategory(b, copy.id);
    expect(mine.mantras.map((x) => x.text)).toEqual(["Gira le spalle"]);
    expect(mine.parentId).not.toBeNull();

    await addMantra(b, copy.id, "Mio");
    const original = await prisma.mantra.findMany({ where: { categoryId: tennis.id } });
    expect(original).toHaveLength(1);

    // seconda copia riusa la radice utente
    await copyFromCatalog(b, tennis.id);
    const roots = (await listUserTree(b)).filter((r) => r.name === `${tag}-Sport`);
    expect(roots).toHaveLength(1);
  });
});
