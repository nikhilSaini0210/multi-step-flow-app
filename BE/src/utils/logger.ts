const isDev = process.env.NODE_ENV !== "production";

type Level = "info" | "warn" | "error" | "debug";

function log(level: Level, message: string, meta?: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {}),
  };

  if (isDev) {
    const color = {
      info: "\x1b[36m",
      warn: "\x1b[33m",
      error: "\x1b[31m",
      debug: "\x1b[90m",
    }[level];
    const reset = "\x1b[0m";
    const prefix = `${color}[${level.toUpperCase()}]${reset}`;
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    console.log(`${prefix} ${entry.timestamp} ${message}${metaStr}`);
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log("info", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) =>
    log("error", msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) =>
    log("debug", msg, meta),
};
