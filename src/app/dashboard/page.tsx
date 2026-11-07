import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createOrder, listOrders } from "@/services/orders";
import { Field, SubmitButton } from "@/components/ui/form";

const eur = (cents: number) =>
  (cents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });

const orderInput = z.object({
  subtotal: z.coerce.number().finite().min(0).max(1_000_000),
  discount: z.coerce.number().finite().min(0).max(100),
});

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await requireUser();
  const orders = await listOrders(user.id);

  async function add(formData: FormData) {
    "use server";
    const u = await requireUser();
    const parsed = orderInput.safeParse({
      subtotal: formData.get("subtotal"),
      discount: formData.get("discount") || 0,
    });
    if (!parsed.success) redirect("/dashboard?error=1");
    await createOrder(u.id, Math.round(parsed.data.subtotal * 100), parsed.data.discount);
    revalidatePath("/dashboard");
  }

  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          Importo o sconto non validi.
        </p>
      )}
      <h1 className="text-2xl font-bold">Ciao {user.name ?? user.email}</h1>
      <form action={add} className="max-w-sm space-y-3">
        <h2 className="font-semibold">Nuovo ordine (esempio di regola di dominio)</h2>
        <Field label="Subtotale (€)" name="subtotal" type="number" step="0.01" min="0" required />
        <Field
          label="Sconto % (max 30 applicato)"
          name="discount"
          type="number"
          min="0"
          defaultValue="0"
        />
        <SubmitButton>Crea ordine</SubmitButton>
      </form>
      <ul className="space-y-1 text-sm" data-testid="orders">
        {orders.map((o) => (
          <li key={o.id}>
            {eur(o.subtotal)} − {eur(o.discount)} = <strong>{eur(o.total)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
