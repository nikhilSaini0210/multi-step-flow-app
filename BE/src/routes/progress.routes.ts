import { Router } from "express";
import { validate } from "../middleware/validate";
import {
  deleteProgressSchema,
  getProgressSchema,
  saveProgressSchema,
} from "../validators/progress.validator";
import { writeRateLimiter } from "../middleware/rateLimiter";
import progressController from "../controllers/progress.controller";

const router = Router();

router.get(
  "/",
  validate(getProgressSchema, "query"),
  progressController.getProgress,
);

router.post(
  "/",
  writeRateLimiter,
  validate(saveProgressSchema, "body"),
  progressController.saveProgress,
);

router.delete(
  "/",
  validate(deleteProgressSchema, "query"),
  progressController.deleteProgress,
);

router.get(
  "/history",
  validate(getProgressSchema, "query"),
  progressController.getHistory,
);

export default router;
