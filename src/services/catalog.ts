import { prisma } from "@/lib/prisma";
import { validateCategoryName, validateMantraText, canAddChild } from "@/domain/mantra/validation";
import { DomainError } from "./categories";

const catalogInclude = {
  mantras: { orderBy: { position: "asc" as const } },
  children: {
    orderBy: { name: "asc" as const },
    include: { mantras: { orderBy: { position: "asc" as const } } },
  },
};

export function listCatalog() {
  return prisma.category.findMany({
    where: { isCatalog: true, parentId: null },
    orderBy: { name: "asc" },
    include: catalogInclude,
  });
}

// --- Gestione catalogo (solo ADMIN: il controllo del ruolo è nelle server action) ---

export async function createCatalogCategory(rawName: string, parentId?: string | null) {
  const name = validateCategoryName(rawName);
  if (!name.ok) throw new DomainError(name.error);
  if (parentId) {
    const parent = await prisma.category.findFirst({ where: { id: parentId, isCatalog: true } });
    if (!parent) throw new DomainError("NOT_FOUND");
    if (!canAddChild(parent.parentId ? 1 : 0)) throw new DomainError("TOO_DEEP");
  }
  return prisma.category.create({
    data: { name: name.value, isCatalog: true, parentId: parentId ?? null },
  });
}

export async function addCatalogMantra(categoryId: string, rawText: string) {
  const text = validateMantraText(rawText);
  if (!text.ok) throw new DomainError(text.error);
  const category = await prisma.category.findFirst({ where: { id: categoryId, isCatalog: true } });
  if (!category) throw new DomainError("NOT_FOUND");
  const last = await prisma.mantra.aggregate({ where: { categoryId }, _max: { position: true } });
  return prisma.mantra.create({
    data: { categoryId, text: text.value, position: (last._max.position ?? -1) + 1 },
  });
}

export async function deleteCatalogCategory(categoryId: string) {
  const { count } = await prisma.category.deleteMany({
    where: { id: categoryId, isCatalog: true },
  });
  if (count === 0) throw new DomainError("NOT_FOUND");
}

/**
 * Copia una categoria del catalogo (con figli e mantra) nello spazio privato dell'utente (R8).
 * Se la categoria ha un genitore, l'utente ottiene (o riusa) una radice con lo stesso nome.
 */
export async function copyFromCatalog(userId: string, catalogCategoryId: string) {
  const source = await prisma.category.findFirst({
    where: { id: catalogCategoryId, isCatalog: true },
    include: { ...catalogInclude, parent: true },
  });
  if (!source) throw new DomainError("NOT_FOUND");

  return prisma.$transaction(async (tx) => {
    let parentId: string | null = null;
    if (source.parent) {
      const existing = await tx.category.findFirst({
        where: { ownerId: userId, parentId: null, name: source.parent.name },
      });
      parentId =
        existing?.id ??
        (await tx.category.create({ data: { name: source.parent.name, ownerId: userId } })).id;
    }
    const root = await tx.category.create({
      data: { name: source.name, ownerId: userId, parentId },
    });
    await tx.mantra.createMany({
      data: source.mantras.map((m) => ({
        categoryId: root.id,
        text: m.text,
        position: m.position,
      })),
    });
    for (const child of source.children) {
      const c = await tx.category.create({
        data: { name: child.name, ownerId: userId, parentId: root.id },
      });
      await tx.mantra.createMany({
        data: child.mantras.map((m) => ({ categoryId: c.id, text: m.text, position: m.position })),
      });
    }
    return root;
  });
}
