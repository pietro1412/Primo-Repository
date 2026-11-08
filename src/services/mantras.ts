import { prisma } from "@/lib/prisma";
import { validateMantraText } from "@/domain/mantra/validation";
import { DomainError } from "./categories";

export async function addMantra(userId: string, categoryId: string, rawText: string) {
  const text = validateMantraText(rawText);
  if (!text.ok) throw new DomainError(text.error);
  const category = await prisma.category.findFirst({ where: { id: categoryId, ownerId: userId } });
  if (!category) throw new DomainError("NOT_FOUND");
  const last = await prisma.mantra.aggregate({ where: { categoryId }, _max: { position: true } });
  return prisma.mantra.create({
    data: { categoryId, text: text.value, position: (last._max.position ?? -1) + 1 },
  });
}

export async function updateMantra(userId: string, mantraId: string, rawText: string) {
  const text = validateMantraText(rawText);
  if (!text.ok) throw new DomainError(text.error);
  const { count } = await prisma.mantra.updateMany({
    where: { id: mantraId, category: { ownerId: userId } },
    data: { text: text.value },
  });
  if (count === 0) throw new DomainError("NOT_FOUND");
}

export async function deleteMantra(userId: string, mantraId: string) {
  const { count } = await prisma.mantra.deleteMany({
    where: { id: mantraId, category: { ownerId: userId } },
  });
  if (count === 0) throw new DomainError("NOT_FOUND");
}
