import { prisma } from "../utils/db";
import { logger } from "../utils/logger";
import type { FlowAnswers, ProgressResponse } from "../types";

const parseAnswers = (json: string): FlowAnswers => {
  try {
    return JSON.parse(json) as FlowAnswers;
  } catch {
    return {};
  }
};

const sessionToResponse = (session: {
  id: string;
  currentStepIndex: number;
  totalSteps: number;
  answersJson: string;
  completed: boolean;
  completedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}): ProgressResponse => {
  return {
    sessionId: session.id,
    currentStepIndex: session.currentStepIndex,
    totalSteps: session.totalSteps,
    answers: parseAnswers(session.answersJson),
    completed: session.completed,
    completedAt: session.completedAt?.toISOString() ?? null,
    updatedAt: session.updatedAt.toISOString(),
    createdAt: session.createdAt.toISOString(),
  };
};

const getProgress = async (
  sessionId: string,
): Promise<ProgressResponse | null> => {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });

  if (!session) {
    return null;
  }

  logger.info("Progress retrieved", {
    sessionId,
    step: session.currentStepIndex,
  });
  return sessionToResponse(session);
};

const saveProgress = async (params: {
  sessionId: string;
  currentStepIndex: number;
  totalSteps: number;
  answers: FlowAnswers;
  completed: boolean;
  ip?: string;
  userAgent?: string;
}): Promise<{ session: ProgressResponse; isNew: boolean }> => {
  const {
    sessionId,
    currentStepIndex,
    totalSteps,
    answers,
    completed,
    ip,
    userAgent,
  } = params;

  if (answers.name) {
    answers.name = answers.name.trim();
  }

  if (answers.interests) {
    answers.interests = [
      ...new Set(
        answers.interests.map((i) => i.trim().toLowerCase()).filter(Boolean),
      ),
    ];
  }

  const answersJson = JSON.stringify(answers);
  const completedAt = completed ? new Date() : undefined;

  const session = await prisma.session.upsert({
    where: { id: sessionId },
    create: {
      id: sessionId,
      currentStepIndex,
      totalSteps,
      answersJson,
      completed,
      completedAt,
      lastIp: ip,
      userAgent,
    },
    update: {
      currentStepIndex,
      totalSteps,
      answersJson,
      completed,
      ...(completed ? { completedAt: completedAt ?? new Date() } : {}),
      lastIp: ip,
      userAgent,
    },
  });

  prisma.progressEvent
    .create({
      data: {
        sessionId,
        stepIndex: currentStepIndex,
        eventType: completed ? "completed" : "step_saved",
        answersSnapshot: answersJson,
      },
    })
    .catch((err: any) =>
      logger.warn("Failed to write progress event", { sessionId, err }),
    );

  const isNew = session.createdAt.getTime() === session.updatedAt.getTime();
  logger.info(
    completed
      ? "Flow completed!"
      : isNew
        ? "Progress saved (new session)"
        : "Progress updated",
    {
      sessionId,
      step: currentStepIndex,
      completed,
    },
  );

  return { session: sessionToResponse(session), isNew };
};

const deleteProgress = async (sessionId: string): Promise<boolean> => {
  const existing = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!existing) {
    return false;
  }

  await prisma.session.delete({ where: { id: sessionId } });
  logger.info("Session deleted", { sessionId });
  return true;
};

const getHistory = async (sessionId: string) => {
  const events = await prisma.progressEvent.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      stepIndex: true,
      eventType: true,
      answersSnapshot: true,
      createdAt: true,
    },
  });

  return events.map((e: any) => ({
    ...e,
    answers: parseAnswers(e.answersSnapshot),
    createdAt: e.createdAt.toISOString(),
  }));
};

export default {
  getProgress,
  saveProgress,
  deleteProgress,
  getHistory,
};
