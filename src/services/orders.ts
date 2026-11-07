import { prisma } from "@/lib/prisma";
import { computeOrderTotal } from "@/domain/example/pricing";

/** Service: orchestra dominio (regole) e persistenza. Nessuna regola di business qui. */
export async function createOrder(userId: string, subtotalCents: number, discountPercent: number) {
  const { subtotal, discount, total } = computeOrderTotal(subtotalCents, discountPercent);
  return prisma.order.create({ data: { userId, subtotal, discount, total } });
}

export function listOrders(userId: string) {
  return prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}
