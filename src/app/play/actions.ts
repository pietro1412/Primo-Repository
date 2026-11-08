"use server";

import { requireUser } from "@/lib/auth";
import { DomainError } from "@/services/categories";
import { endSession, recordPlays, startSession } from "@/services/sessions";

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

async function guard<T>(fn: (userId: string) => Promise<T>): Promise<Result<T>> {
  const user = await requireUser();
  try {
    return { ok: true, value: await fn(user.id) };
  } catch (e) {
    if (e instanceof DomainError) return { ok: false, error: e.code };
    throw e;
  }
}

export async function startSessionAction(input: {
  categoryId: string;
  style: string;
  minutes: number;
  pauseSeconds: number;
}) {
  return guard(async (uid) => (await startSession(uid, input)).id);
}

export async function recordPlaysAction(
  sessionId: string,
  day: string,
  plays: { mantraId: string; count: number }[],
) {
  return guard((uid) => recordPlays(uid, sessionId, day, plays));
}

export async function endSessionAction(sessionId: string) {
  return guard((uid) => endSession(uid, sessionId));
}
