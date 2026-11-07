import type { NextAuthConfig } from "next-auth";

// Configurazione edge-safe (senza DB): usata anche dal middleware.
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      const isProtected = path.startsWith("/dashboard") || path.startsWith("/admin");
      if (!isProtected) return true;
      if (!auth?.user) return false;
      if (path.startsWith("/admin") && auth.user.role !== "ADMIN") return false;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "ADMIN" | "USER";
      return session;
    },
  },
} satisfies NextAuthConfig;
