import { expect, test } from "@playwright/test";

const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const password = process.env.SEED_ADMIN_PASSWORD ?? "change-me-please";

test("login admin → dashboard → ordine con sconto limitato", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Accedi" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.getByLabel("Subtotale (€)").fill("100");
  await page.getByLabel(/Sconto/).fill("90");
  await page.getByRole("button", { name: "Crea ordine" }).click();
  await expect(page.getByTestId("orders")).toContainText("70,00");
});

test("utente non autenticato non accede ad /admin", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
});

test("input non valido sulla dashboard mostra un errore, non un 500", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Accedi" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.getByLabel("Subtotale (€)").fill("10");
  await page.getByLabel(/Sconto/).fill("-5");
  await page
    .getByRole("button", { name: "Crea ordine" })
    .evaluate((b) => ((b as HTMLButtonElement).form!.noValidate = true));
  await page.getByRole("button", { name: "Crea ordine" }).click();
  await expect(page.getByText("Importo o sconto non validi.")).toBeVisible();
});
