import { requireUser } from "@/lib/auth";
import { listCatalog } from "@/services/catalog";
import {
  addCatalogMantraAction,
  createCatalogCategoryAction,
  deleteCatalogCategoryAction,
} from "./actions";

export default async function AdminCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser("ADMIN");
  const { error } = await searchParams;
  const catalog = await listCatalog();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Catalogo (admin)</h1>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          Errore: {error}
        </p>
      )}
      {catalog.map((root) => (
        <section key={root.id} className="rounded border bg-white p-3">
          <h2 className="font-semibold">{root.name}</h2>
          {root.children.map((c) => (
            <div key={c.id} className="mt-2 ml-3 text-sm">
              <div className="flex justify-between">
                <strong>{c.name}</strong>
                <form action={deleteCatalogCategoryAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-red-600 underline">Elimina</button>
                </form>
              </div>
              <ul>
                {c.mantras.map((m) => (
                  <li key={m.id}>{m.text}</li>
                ))}
              </ul>
              <form action={addCatalogMantraAction} className="mt-1 flex gap-2">
                <input type="hidden" name="categoryId" value={c.id} />
                <input
                  name="text"
                  aria-label={`Mantra per ${c.name}`}
                  className="flex-1 rounded border px-2 py-1"
                />
                <button className="rounded border px-2">Aggiungi</button>
              </form>
            </div>
          ))}
          <form action={createCatalogCategoryAction} className="mt-2 ml-3 flex gap-2 text-sm">
            <input type="hidden" name="parentId" value={root.id} />
            <input
              name="name"
              aria-label={`Sottocategoria di ${root.name}`}
              className="flex-1 rounded border px-2 py-1"
            />
            <button className="rounded border px-2">Crea</button>
          </form>
        </section>
      ))}
      <form action={createCatalogCategoryAction} className="flex max-w-sm gap-2">
        <input
          name="name"
          aria-label="Nuova categoria catalogo"
          className="flex-1 rounded border px-2 py-1"
        />
        <button className="rounded bg-black px-3 py-1 text-white">Crea categoria</button>
      </form>
    </div>
  );
}
