import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listUserTree } from "@/services/categories";
import { Field, SubmitButton } from "@/components/ui/form";
import {
  addMantraAction,
  createCategoryAction,
  deleteCategoryAction,
  deleteMantraAction,
} from "./actions";

type Tree = Awaited<ReturnType<typeof listUserTree>>;
type Node = Tree[number] | Tree[number]["children"][number];

const ERRORS: Record<string, string> = {
  EMPTY: "Il testo non può essere vuoto.",
  TOO_LONG: "Testo troppo lungo.",
  TOO_DEEP: "Massimo due livelli di categorie.",
  NOT_FOUND: "Elemento non trovato.",
};

function CategoryBlock({ cat }: { cat: Node }) {
  return (
    <section className="rounded border bg-white p-3" data-testid={`cat-${cat.name}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{cat.name}</h3>
        <div className="flex gap-3 text-sm">
          <Link href={`/play/${cat.id}`} className="underline">
            Ascolta
          </Link>
          <form action={deleteCategoryAction}>
            <input type="hidden" name="id" value={cat.id} />
            <button className="text-red-600 underline">Elimina</button>
          </form>
        </div>
      </div>
      <ul className="mt-2 space-y-1 text-sm">
        {cat.mantras.map((m) => (
          <li key={m.id} className="flex items-center justify-between">
            <span>{m.text}</span>
            <form action={deleteMantraAction}>
              <input type="hidden" name="id" value={m.id} />
              <button aria-label={`Elimina ${m.text}`} className="text-gray-500">
                ✕
              </button>
            </form>
          </li>
        ))}
      </ul>
      <form action={addMantraAction} className="mt-2 flex gap-2">
        <input type="hidden" name="categoryId" value={cat.id} />
        <input
          name="text"
          aria-label={`Nuovo mantra per ${cat.name}`}
          placeholder="Nuovo mantra…"
          maxLength={140}
          className="flex-1 rounded border px-2 py-1 text-sm"
        />
        <button className="rounded bg-black px-3 py-1 text-sm text-white">Aggiungi</button>
      </form>
    </section>
  );
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { error } = await searchParams;
  const tree = await listUserTree(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">I miei mantra</h1>
        <Link href="/library/catalog" className="text-sm underline">
          Aggiungi dal catalogo
        </Link>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {ERRORS[error] ?? "Operazione non riuscita."}
        </p>
      )}

      {tree.length === 0 && (
        <p className="text-gray-600">Nessuna categoria: creane una o copiala dal catalogo.</p>
      )}

      {tree.map((root) => (
        <div key={root.id} className="space-y-2">
          <CategoryBlock cat={root} />
          <div className="ml-4 space-y-2">
            {root.children.map((child) => (
              <CategoryBlock key={child.id} cat={child} />
            ))}
            <form action={createCategoryAction} className="flex gap-2">
              <input type="hidden" name="parentId" value={root.id} />
              <input
                name="name"
                aria-label={`Nuova sottocategoria di ${root.name}`}
                placeholder="Nuova sottocategoria…"
                className="flex-1 rounded border px-2 py-1 text-sm"
              />
              <button className="rounded border px-3 py-1 text-sm">Crea</button>
            </form>
          </div>
        </div>
      ))}

      <form action={createCategoryAction} className="max-w-sm space-y-3">
        <h2 className="font-semibold">Nuova categoria</h2>
        <Field label="Nome" name="name" required />
        <SubmitButton>Crea categoria</SubmitButton>
      </form>
    </div>
  );
}
