"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createCategory, deleteCategory, DomainError } from "@/services/categories";
import { addMantra, deleteMantra } from "@/services/mantras";
import { copyFromCatalog } from "@/services/catalog";

async function run(path: string, fn: (userId: string) => Promise<unknown>) {
  const user = await requireUser();
  try {
    await fn(user.id);
  } catch (e) {
    if (e instanceof DomainError) redirect(`${path}?error=${e.code}`);
    throw e;
  }
  revalidatePath("/library");
  redirect(path);
}

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");

export async function createCategoryAction(formData: FormData) {
  await run("/library", (uid) =>
    createCategory(uid, str(formData.get("name")), str(formData.get("parentId")) || null),
  );
}

export async function deleteCategoryAction(formData: FormData) {
  await run("/library", (uid) => deleteCategory(uid, str(formData.get("id"))));
}

export async function addMantraAction(formData: FormData) {
  await run("/library", (uid) =>
    addMantra(uid, str(formData.get("categoryId")), str(formData.get("text"))),
  );
}

export async function deleteMantraAction(formData: FormData) {
  await run("/library", (uid) => deleteMantra(uid, str(formData.get("id"))));
}

export async function copyFromCatalogAction(formData: FormData) {
  await run("/library", (uid) => copyFromCatalog(uid, str(formData.get("id"))));
}
