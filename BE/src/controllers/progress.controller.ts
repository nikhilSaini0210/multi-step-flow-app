import { Request, Response, NextFunction } from "express";
import { sendSuccess, send404 } from "../utils/response";
import type { FlowAnswers } from "../types";
import progressService from "../services/progress.service";

function getSessionId(req: Request, res: Response): string {
  return (
    res.locals?.validated?.query?.sessionId ??
    (req.query.sessionId as string | undefined) ??
    ""
  );
}

export const getProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sessionId = getSessionId(req, res);
    const session = await progressService.getProgress(sessionId);

    if (!session) {
      send404(
        res,
        `No progress found for session "${sessionId}". Starting fresh.`,
      );
      return;
    }

    sendSuccess(res, session, "Progress retrieved");
  } catch (err) {
    next(err);
  }
};

export const saveProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { sessionId, currentStepIndex, totalSteps, answers, completed } =
      req.body as {
        sessionId: string;
        currentStepIndex: number;
        totalSteps: number;
        answers: FlowAnswers;
        completed: boolean;
      };

    const { session, isNew } = await progressService.saveProgress({
      sessionId,
      currentStepIndex,
      totalSteps,
      answers,
      completed,
      ip: req.ip,
      userAgent: req.headers["user-agent"]?.slice(0, 200),
    });

    const message = completed
      ? "Flow completed!"
      : isNew
        ? "Progress saved (new session)"
        : "Progress updated";

    sendSuccess(res, session, message, isNew ? 201 : 200);
  } catch (err) {
    next(err);
  }
};

export const deleteProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sessionId = getSessionId(req, res);
    const deleted = await progressService.deleteProgress(sessionId);

    if (!deleted) {
      sendSuccess(res, null, "Session not found — nothing to delete");
      return;
    }

    sendSuccess(res, { sessionId }, "Progress reset successfully");
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sessionId = getSessionId(req, res);
    const data = await progressService.getHistory(sessionId);

    if (!data.length) {
      send404(res, "No history found for this session");
      return;
    }

    sendSuccess(res, data, `${data.length} event(s) found`);
  } catch (err) {
    next(err);
  }
};

export default {
  getProgress,
  saveProgress,
  deleteProgress,
  getHistory,
};
