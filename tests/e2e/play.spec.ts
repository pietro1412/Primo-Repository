import { expect, test } from "@playwright/test";

test("sessione con voce finta: le frasi completate vengono contate e salvate", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Email").fill(`play-${Date.now()}@example.com`);
  await page.getByLabel(/Password/).fill("e2e-password-123");
  await page.getByRole("button", { name: "Crea account" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/library/catalog");
  await page.getByRole("button", { name: "Aggiungi Tennis" }).click();
  await page.getByTestId("cat-Tennis").getByRole("link", { name: "Ascolta" }).click();
  await expect(page).toHaveURL(/\/play\//);

  // aggiunge ?engine=fake all'URL corrente e ricarica
  await page.goto(`${page.url()}?engine=fake`);
  await expect(page.getByTestId("totals")).toContainText("totali 0");
  await page.getByLabel("Pausa tra le frasi (secondi)").fill("0");
  await page.getByRole("button", { name: "Avvia" }).click();
  await expect(page.getByTestId("session-plays")).toContainText(/In questa sessione: [1-9]/);
  await page.getByRole("button", { name: "Ferma" }).click();
  await expect(page.getByRole("button", { name: "Avvia" })).toBeVisible();

  await page.reload();
  const text = await page.getByTestId("totals").innerText();
  expect(text).toMatch(/totali [1-9]/);
});
