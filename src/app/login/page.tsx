import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { Field, SubmitButton } from "@/components/ui/form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/dashboard",
      });
    } catch (e) {
      if (e instanceof AuthError) redirect("/login?error=1");
      throw e;
    }
  }
  return (
    <form action={login} className="max-w-sm space-y-4">
      <h1 className="text-xl font-bold">Accedi</h1>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          Credenziali non valide.
        </p>
      )}
      <Field label="Email" name="email" type="email" required />
      <Field label="Password" name="password" type="password" required />
      <SubmitButton>Accedi</SubmitButton>
    </form>
  );
}
