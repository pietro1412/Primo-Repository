import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const registerSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1).max(100).optional(),
  password: z.string().min(8).max(200),
});

export async function registerUser(input: unknown) {
  const data = registerSchema.parse(input);
  const email = data.email.toLowerCase();
  if (await prisma.user.findUnique({ where: { email } })) {
    throw new Error("EMAIL_TAKEN");
  }
  const passwordHash = await bcrypt.hash(data.password, 12);
  return prisma.user.create({ data: { email, name: data.name, passwordHash } });
}
