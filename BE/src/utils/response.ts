import { Response } from "express";
import { ApiError, ApiSuccess } from "../types";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
): void => {
  const b: ApiSuccess<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
  };

  res.status(statusCode).json(b);
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
): void => {
  const b: ApiError = {
    success: false,
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  };
  res.status(statusCode).json(b);
};

export const send400 = (res: Response, message: string, details?: unknown) =>
  sendError(res, 400, "BAD_REQUEST", message, details);

export const send404 = (res: Response, message = "Resource not found") =>
  sendError(res, 404, "NOT_FOUND", message);

export const send409 = (res: Response, message: string) =>
  sendError(res, 409, "CONFLICT", message);

export const send422 = (res: Response, message: string, details?: unknown) =>
  sendError(res, 422, "VALIDATION_ERROR", message, details);

export const send429 = (res: Response, message = "Too many requests") =>
  sendError(res, 429, "RATE_LIMITED", message);

export const send500 = (res: Response, message = "Internal server error") =>
  sendError(res, 500, "INTERNAL_ERROR", message);
