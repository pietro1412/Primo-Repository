"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { DomainError } from "@/services/categories";
import { addCatalogMantra, createCatalogCategory, deleteCatalogCategory } from "@/services/catalog";

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");

async function run(fn: () => Promise<unknown>) {
  await requireUser("ADMIN");
  try {
    await fn();
  } catch (e) {
    if (e instanceof DomainError) redirect(`/admin/catalog?error=${e.code}`);
    throw e;
  }
  revalidatePath("/admin/catalog");
  redirect("/admin/catalog");
}

export async function createCatalogCategoryAction(formData: FormData) {
  await run(() =>
    createCatalogCategory(str(formData.get("name")), str(formData.get("parentId")) || null),
  );
}

export async function addCatalogMantraAction(formData: FormData) {
  await run(() => addCatalogMantra(str(formData.get("categoryId")), str(formData.get("text"))));
}

export async function deleteCatalogCategoryAction(formData: FormData) {
  await run(() => deleteCatalogCategory(str(formData.get("id"))));
}
