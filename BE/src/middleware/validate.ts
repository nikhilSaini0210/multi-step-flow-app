import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { send422 } from "../utils/response";

type Source = "body" | "query" | "params";

export const validate = (schema: ZodType, source: Source = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = formatZodError(result.error);
      send422(res, "Validation failed", details);
      return;
    }

    if (source === "body") {
      req.body = result.data;
    } else {
      if (!res.locals.validated) {
        res.locals.validated = {};
      }
      res.locals.validated[source] = result.data;
    }

    next();
  };
};

const formatZodError = (
  error: ZodError,
): Array<{ field: string; message: string }> => {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
  }));
};
