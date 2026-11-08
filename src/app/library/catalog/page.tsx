import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listCatalog } from "@/services/catalog";
import { copyFromCatalogAction } from "../actions";

export default async function CatalogPage() {
  await requireUser();
  const catalog = await listCatalog();
  return (
    <div className="space-y-4">
      <Link href="/library" className="text-sm underline">
        ← I miei mantra
      </Link>
      <h1 className="text-2xl font-bold">Catalogo</h1>
      {catalog.map((root) => (
        <section key={root.id} className="space-y-2">
          <h2 className="font-semibold">{root.name}</h2>
          {root.children.map((c) => (
            <div key={c.id} className="rounded border bg-white p-3">
              <div className="flex items-center justify-between">
                <h3>{c.name}</h3>
                <form action={copyFromCatalogAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="rounded bg-black px-3 py-1 text-sm text-white">
                    Aggiungi {c.name}
                  </button>
                </form>
              </div>
              <ul className="mt-1 text-sm text-gray-600">
                {c.mantras.map((m) => (
                  <li key={m.id}>{m.text}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
