import { prisma } from "../utils/db";

const healthCheck = async () => {
  const start = Date.now();
  let dbStatus = "ok";
  let dbLatencyMs = 0;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
  } catch {
    dbStatus = "error";
  }

  const healthy = dbStatus === "ok";

  const data = {
    status: healthy ? "ok" : "degraded",
    version: process.env.npm_package_version ?? "1.0.0",
    env: process.env.NODE_ENV ?? "development",
    uptime: Math.floor(process.uptime()),
    db: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    timestamp: new Date().toISOString(),
  };

  return { healthy, data };
};

export default {
  healthCheck,
};
