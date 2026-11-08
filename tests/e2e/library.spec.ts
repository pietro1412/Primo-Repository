import { expect, test } from "@playwright/test";

const email = `e2e-${Date.now()}@example.com`;
const password = "e2e-password-123";

test("registrazione, catalogo, nuovo mantra e privacy", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel(/Password/).fill(password);
  await page.getByRole("button", { name: "Crea account" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/library/catalog");
  await page.getByRole("button", { name: "Aggiungi Tennis" }).click();
  await expect(page).toHaveURL(/\/library$/);
  const tennis = page.getByTestId("cat-Tennis");
  await expect(tennis).toContainText("Guarda la palla");

  await page.getByLabel("Nuovo mantra per Tennis").fill("Resta basso");
  await tennis.getByRole("button", { name: "Aggiungi", exact: true }).click();
  await expect(tennis).toContainText("Resta basso");

  await page.getByLabel("Nuovo mantra per Tennis").fill("   ");
  await tennis.getByRole("button", { name: "Aggiungi", exact: true }).click();
  await expect(page.getByText("Il testo non può essere vuoto.")).toBeVisible();
});

test("un utente non-admin non accede al catalogo admin", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Email").fill(`e2e2-${Date.now()}@example.com`);
  await page.getByLabel(/Password/).fill(password);
  await page.getByRole("button", { name: "Crea account" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/admin/catalog");
  await expect(page).toHaveURL(/\/dashboard/);
});
