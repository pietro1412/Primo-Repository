import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { registerUser } from "@/services/users";
import { Field, SubmitButton } from "@/components/ui/form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  async function register(formData: FormData) {
    "use server";
    const input = {
      email: formData.get("email"),
      name: (formData.get("name") as string) || undefined,
      password: formData.get("password"),
    };
    try {
      await registerUser(input);
    } catch {
      redirect("/register?error=1");
    }
    await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirectTo: "/dashboard",
    });
  }
  return (
    <form action={register} className="max-w-sm space-y-4">
      <h1 className="text-xl font-bold">Registrati</h1>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          Dati non validi o email già in uso.
        </p>
      )}
      <Field label="Nome" name="name" />
      <Field label="Email" name="email" type="email" required />
      <Field
        label="Password (min 8 caratteri)"
        name="password"
        type="password"
        minLength={8}
        required
      />
      <SubmitButton>Crea account</SubmitButton>
    </form>
  );
}
