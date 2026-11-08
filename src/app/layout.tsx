import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Platform Scaffold",
  description: "Scaffold per piattaforme web",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="it">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="flex items-center justify-between border-b bg-white px-6 py-3">
          <Link href="/" className="font-semibold">
            Platform
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {session?.user ? (
              <>
                <Link href="/library">Mantra</Link>
                {session.user.role === "ADMIN" && <Link href="/admin/catalog">Catalogo</Link>}
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button className="underline">Esci</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">Accedi</Link>
                <Link href="/register">Registrati</Link>
              </>
            )}
          </nav>
        </header>
        <main className="mx-auto max-w-3xl p-6">{children}</main>
      </body>
    </html>
  );
}
