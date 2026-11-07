import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Next.js 16: "proxy" sostituisce "middleware". Protegge /dashboard e /admin.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
