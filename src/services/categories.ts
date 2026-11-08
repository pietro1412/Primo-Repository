import { prisma } from "@/lib/prisma";
import { canAddChild, validateCategoryName } from "@/domain/mantra/validation";

export class DomainError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

/** Categorie radice dell'utente con figli e mantra (R7: solo del proprietario). */
export function listUserTree(userId: string) {
  return prisma.category.findMany({
    where: { ownerId: userId, parentId: null },
    orderBy: { name: "asc" },
    include: {
      mantras: { orderBy: { position: "asc" } },
      children: {
        orderBy: { name: "asc" },
        include: { mantras: { orderBy: { position: "asc" } } },
      },
    },
  });
}

export async function getOwnedCategory(userId: string, categoryId: string) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, ownerId: userId },
    include: { mantras: { orderBy: { position: "asc" } } },
  });
  if (!category) throw new DomainError("NOT_FOUND");
  return category;
}

export async function createCategory(userId: string, rawName: string, parentId?: string | null) {
  const name = validateCategoryName(rawName);
  if (!name.ok) throw new DomainError(name.error);
  if (parentId) {
    const parent = await prisma.category.findFirst({ where: { id: parentId, ownerId: userId } });
    if (!parent) throw new DomainError("NOT_FOUND");
    if (!canAddChild(parent.parentId ? 1 : 0)) throw new DomainError("TOO_DEEP");
  }
  return prisma.category.create({
    data: { name: name.value, ownerId: userId, parentId: parentId ?? null },
  });
}

export async function deleteCategory(userId: string, categoryId: string) {
  const { count } = await prisma.category.deleteMany({
    where: { id: categoryId, ownerId: userId },
  });
  if (count === 0) throw new DomainError("NOT_FOUND");
}
