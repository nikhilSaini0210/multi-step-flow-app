import rateLimit from "express-rate-limit";
import { send429 } from "../utils/response";

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "900000", 10);
const max = parseInt(process.env.RATE_LIMIT_MAX ?? "100", 10);

export const rateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (_req, res) => {
    send429(
      res,
      `Too many requests. Limit: ${max} per ${windowMs / 60000} minutes.`,
    );
  },
});

export const writeRateLimiter = rateLimit({
  windowMs: 60000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    send429(res, "Too many save requests. Please slow down.");
  },
});
