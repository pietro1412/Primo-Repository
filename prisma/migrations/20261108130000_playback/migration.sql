-- CreateEnum
CREATE TYPE "VoiceStyle" AS ENUM ('CALM', 'ENERGETIC', 'SHOUT', 'WHISPER');

-- CreateEnum
CREATE TYPE "PlaybackTrigger" AS ENUM ('MANUAL', 'SCHEDULE');

-- CreateTable
CREATE TABLE "PlaybackSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "style" "VoiceStyle" NOT NULL,
    "plannedMinutes" INTEGER NOT NULL,
    "pauseSeconds" INTEGER NOT NULL,
    "trigger" "PlaybackTrigger" NOT NULL DEFAULT 'MANUAL',
    "totalPlays" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "PlaybackSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MantraPlayCount" (
    "userId" TEXT NOT NULL,
    "mantraId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MantraPlayCount_pkey" PRIMARY KEY ("userId","mantraId","day")
);

-- CreateIndex
CREATE INDEX "PlaybackSession_userId_startedAt_idx" ON "PlaybackSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "MantraPlayCount_userId_day_idx" ON "MantraPlayCount"("userId", "day");

-- AddForeignKey
ALTER TABLE "PlaybackSession" ADD CONSTRAINT "PlaybackSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybackSession" ADD CONSTRAINT "PlaybackSession_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MantraPlayCount" ADD CONSTRAINT "MantraPlayCount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MantraPlayCount" ADD CONSTRAINT "MantraPlayCount_mantraId_fkey" FOREIGN KEY ("mantraId") REFERENCES "Mantra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

