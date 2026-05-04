import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { logger } from "./utils/logger";
import { connectDB, disconnectDB } from "./utils/db";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import progressRoutes from "./routes/progress.routes";
import healthRoutes from "./routes/health.routes";

const app = express();
const PORT = parseInt(process.env.PORT ?? "3000", 10);

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin "${origin}" is not allowed`));
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: [
      "RateLimit-Limit",
      "RateLimit-Remaining",
      "RateLimit-Reset",
    ],
    credentials: true,
    maxAge: 86400,
  }),
);

const maxPayload = parseInt(process.env.MAX_PAYLOAD_SIZE ?? "51200", 10);
app.use(express.json({ limit: maxPayload }));
app.use(express.urlencoded({ extended: false, limit: maxPayload }));

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

app.use(rateLimiter);

app.set("trust proxy", 1);

app.use("/health", healthRoutes);
app.use('/progress', progressRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "Multi Step Flow API",
    version: "1.0.0",
    docs: "See README.md for endpoint documentation",
    health: "/health",
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`Server running`, { port: PORT, env: process.env.NODE_ENV });
    logger.info(`Health check: http://localhost:${PORT}/health`);
    logger.info(`Progress API: http://localhost:${PORT}/progress`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);

    server.close(async () => {
      await disconnectDB();
      logger.info("Server closed");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", { reason: String(reason) });
  });
  process.on("uncaughtException", (err) => {
    logger.error("Uncaught exception", {
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });
};

start();

export default app;
