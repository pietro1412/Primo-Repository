import Link from "next/link";
import { requireUser } from "@/lib/auth";

export default async function Dashboard() {
  const user = await requireUser();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Ciao {user.name ?? user.email}</h1>
      <p className="text-gray-600">Costruisci i tuoi mantra e riascoltali mentre ti alleni.</p>
      <Link href="/library" className="inline-block rounded bg-black px-4 py-2 text-white">
        I miei mantra
      </Link>
    </div>
  );
}
