import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

// Hash bcrypt (cost 12) di una stringa casuale, usato solo per equalizzare i tempi di risposta.
const DUMMY_HASH = "$2b$12$3IYsA2cCN.FHlaLLeTX0gOd9itkuObndGNmoI4Mdy49OONVc1musC";

const credentialsSchema = z.object({ email: z.email(), password: z.string().min(8) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        // Confronto sempre eseguito (hash fittizio se l'utente non esiste) per tempi uniformi.
        const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !ok) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});

/** Richiede un utente autenticato (con ruolo opzionale); altrimenti reindirizza. */
export async function requireUser(role?: "ADMIN" | "USER") {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (role && session.user.role !== role) redirect("/dashboard");
  return session.user;
}
