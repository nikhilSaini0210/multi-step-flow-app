import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { logger } from "../utils/logger";
import { sendError } from "../utils/response";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (res.headersSent) {
    return;
  }

  logger.error("Unhandled error", {
    method: req.method,
    url: req.originalUrl,
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        sendError(
          res,
          409,
          "CONFLICT",
          "A record with this identifier already exists",
        );
        return;
      case "P2025":
        sendError(res, 404, "NOT_FOUND", "Record not found");
        return;
      case "P2003":
        sendError(res, 400, "BAD_REQUEST", "Related record not found");
        return;
      default:
        sendError(res, 500, "DATABASE_ERROR", "A database error occurred");
        return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, 400, "BAD_REQUEST", "Invalid data provided to the database");
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    sendError(res, 400, "BAD_REQUEST", "Invalid JSON in request body");
    return;
  }

  if ((err as any)?.type === "entity.too.large") {
    sendError(res, 413, "PAYLOAD_TOO_LARGE", "Request body is too large");
    return;
  }

  const message =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err instanceof Error
        ? err.message
        : "Unknown error";

  sendError(res, 500, "INTERNAL_ERROR", message);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(
    res,
    404,
    "NOT_FOUND",
    `Route ${req.method} ${req.originalUrl} not found`,
  );
};
