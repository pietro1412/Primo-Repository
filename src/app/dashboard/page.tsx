import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createOrder, listOrders } from "@/services/orders";
import { Field, SubmitButton } from "@/components/ui/form";

const eur = (cents: number) =>
  (cents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });

export default async function Dashboard() {
  const user = await requireUser();
  const orders = await listOrders(user.id);

  async function add(formData: FormData) {
    "use server";
    const u = await requireUser();
    const subtotal = Math.round(Number(formData.get("subtotal")) * 100);
    const discount = Number(formData.get("discount") || 0);
    await createOrder(u.id, subtotal, discount);
    revalidatePath("/dashboard");
  }

  return (
    <div className="space-y-6">
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
