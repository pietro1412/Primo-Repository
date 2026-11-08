import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { DomainError, getOwnedCategory } from "@/services/categories";
import { categoryTotals } from "@/services/sessions";
import { Player } from "./player";

export default async function PlayPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const user = await requireUser();
  const { categoryId } = await params;
  const category = await getOwnedCategory(user.id, categoryId).catch((e) => {
    if (e instanceof DomainError) return null;
    throw e;
  });
  if (!category) notFound();

  // Il "giorno" locale esatto dipende dal fuso del client: qui mostriamo solo il totale
  // iniziale; il client aggiorna "oggi" mentre riproduce. Il valore "oggi" lato server usa la data UTC.
  const today = new Date().toISOString().slice(0, 10);
  const totals = await categoryTotals(user.id, category.id, today);

  return (
    <div className="space-y-4">
      <Link href="/library" className="text-sm underline">
        ← I miei mantra
      </Link>
      <h1 className="text-2xl font-bold">{category.name}</h1>
      {category.mantras.length === 0 ? (
        <p className="text-gray-600">Aggiungi almeno un mantra per poterlo ascoltare.</p>
      ) : (
        <Player
          categoryId={category.id}
          categoryName={category.name}
          mantras={category.mantras.map((m) => ({ id: m.id, text: m.text }))}
          totals={totals}
        />
      )}
    </div>
  );
}
