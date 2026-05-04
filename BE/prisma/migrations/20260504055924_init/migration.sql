-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "currentStepIndex" INTEGER NOT NULL DEFAULT 0,
    "totalSteps" INTEGER NOT NULL DEFAULT 4,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "answersJson" TEXT NOT NULL DEFAULT '{}',
    "lastIp" TEXT,
    "userAgent" TEXT
);

-- CreateTable
CREATE TABLE "progress_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "answersSnapshot" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "progress_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "progress_events_sessionId_idx" ON "progress_events"("sessionId");
