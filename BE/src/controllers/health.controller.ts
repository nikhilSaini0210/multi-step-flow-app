import { Request, Response } from "express";
import { sendSuccess } from "../utils/response";
import healthService from "../services/health.service";

const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  const { healthy, data } = await healthService.healthCheck();

  if (healthy) {
    sendSuccess(res, data);
  } else {
    res.status(503).json({ success: false, data });
  }
};

export default {
  healthCheck,
};
