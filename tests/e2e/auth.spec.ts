import { expect, test } from "@playwright/test";

const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const password = process.env.SEED_ADMIN_PASSWORD ?? "change-me-please";

test("login admin → dashboard → libreria", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Accedi" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.getByRole("link", { name: "I miei mantra" }).click();
  await expect(page).toHaveURL(/\/library/);
  await page.goto("/admin/catalog");
  await expect(page.getByRole("heading", { name: "Catalogo (admin)" })).toBeVisible();
});

test("utente non autenticato non accede ad /admin", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
});
