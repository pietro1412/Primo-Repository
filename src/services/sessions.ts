import { prisma } from "@/lib/prisma";
import { isVoiceStyle } from "@/domain/mantra/styles";
import { normalizePlays, parseLocalDay, validateSessionConfig } from "@/domain/mantra/session";
import { DomainError } from "./categories";

export async function startSession(
  userId: string,
  input: { categoryId: string; style: string; minutes: number; pauseSeconds: number },
  trigger: "MANUAL" | "SCHEDULE" = "MANUAL",
) {
  if (!isVoiceStyle(input.style)) throw new DomainError("INVALID_STYLE");
  const invalid = validateSessionConfig(input.minutes, input.pauseSeconds);
  if (invalid) throw new DomainError(invalid);
  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, ownerId: userId },
    include: { _count: { select: { mantras: true } } },
  });
  if (!category) throw new DomainError("NOT_FOUND");
  if (category._count.mantras === 0) throw new DomainError("NO_MANTRAS");
  return prisma.playbackSession.create({
    data: {
      userId,
      categoryId: category.id,
      style: input.style,
      plannedMinutes: input.minutes,
      pauseSeconds: input.pauseSeconds,
      trigger,
    },
  });
}

/**
 * Registra un blocco di riproduzioni completate (R5) aggregandole per giorno locale (R6).
 * Accetta solo mantra appartenenti alla categoria della sessione dell'utente (R7).
 */
export async function recordPlays(
  userId: string,
  sessionId: string,
  day: string,
  plays: { mantraId: string; count: number }[],
) {
  const localDay = parseLocalDay(day);
  const normalized = normalizePlays(plays);
  if (!localDay || !normalized) throw new DomainError("INVALID_PLAYS");

  const session = await prisma.playbackSession.findFirst({ where: { id: sessionId, userId } });
  if (!session) throw new DomainError("NOT_FOUND");
  if (session.endedAt) throw new DomainError("SESSION_ENDED");

  const valid = await prisma.mantra.findMany({
    where: { id: { in: normalized.map((p) => p.mantraId) }, categoryId: session.categoryId },
    select: { id: true },
  });
  if (valid.length !== normalized.length) throw new DomainError("INVALID_PLAYS");

  const dayDate = new Date(`${localDay}T00:00:00Z`);
  const total = normalized.reduce((n, p) => n + p.count, 0);
  await prisma.$transaction([
    ...normalized.map((p) =>
      prisma.mantraPlayCount.upsert({
        where: { userId_mantraId_day: { userId, mantraId: p.mantraId, day: dayDate } },
        create: { userId, mantraId: p.mantraId, day: dayDate, count: p.count },
        update: { count: { increment: p.count } },
      }),
    ),
    prisma.playbackSession.update({
      where: { id: sessionId },
      data: { totalPlays: { increment: total } },
    }),
  ]);
  return total;
}

export async function endSession(userId: string, sessionId: string) {
  await prisma.playbackSession.updateMany({
    where: { id: sessionId, userId, endedAt: null },
    data: { endedAt: new Date() },
  });
}

/** Totali di riproduzioni per i mantra di una categoria dell'utente. */
export async function categoryTotals(userId: string, categoryId: string, today: string) {
  const day = parseLocalDay(today);
  const [all, todayAgg] = await Promise.all([
    prisma.mantraPlayCount.aggregate({
      where: { userId, mantra: { categoryId } },
      _sum: { count: true },
    }),
    day
      ? prisma.mantraPlayCount.aggregate({
          where: { userId, mantra: { categoryId }, day: new Date(`${day}T00:00:00Z`) },
          _sum: { count: true },
        })
      : null,
  ]);
  return { total: all._sum.count ?? 0, today: todayAgg?._sum.count ?? 0 };
}
