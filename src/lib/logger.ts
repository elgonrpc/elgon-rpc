const LEVELS: Record<string, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const THRESHOLD = LEVELS[process.env.LOG_LEVEL || "info"] ?? 1;

function emit(level: string, msg: string, meta?: Record<string, unknown>) {
  if ((LEVELS[level] ?? 1) < THRESHOLD) return;
  const line = `${new Date().toISOString()} [${level.toUpperCase()}] ${msg}`;
  const out = meta ? `${line} ${JSON.stringify(meta)}` : line;
  (level === "error" ? console.error : level === "warn" ? console.warn : console.log)(out);
}

export const logger = {
  debug: (m: string, x?: Record<string, unknown>) => emit("debug", m, x),
  info: (m: string, x?: Record<string, unknown>) => emit("info", m, x),
  warn: (m: string, x?: Record<string, unknown>) => emit("warn", m, x),
  error: (m: string, x?: Record<string, unknown>) => emit("error", m, x),
};
