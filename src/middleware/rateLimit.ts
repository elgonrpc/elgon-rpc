import { Request, Response, NextFunction } from "express";

interface Window { count: number; resetAt: number; }

const WINDOW_MS = 60_000;
const windows = new Map<string, Window>();

function identify(req: Request): string {
  return String(req.query.key || "") || req.ip || "unknown";
}

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const id = identify(req);
  const limit = (res.locals.rateLimit as number) || 60;
  const now = Date.now();

  let win = windows.get(id);
  if (!win || now > win.resetAt) {
    win = { count: 0, resetAt: now + WINDOW_MS };
    windows.set(id, win);
  }
  win.count++;

  res.setHeader("X-RateLimit-Limit", limit);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - win.count));
  res.setHeader("X-RateLimit-Reset", Math.ceil(win.resetAt / 1000));

  if (win.count > limit) {
    res.status(429).json({
      error: "Rate limit exceeded",
      retryAfter: Math.ceil((win.resetAt - now) / 1000),
    });
    return;
  }
  next();
}

// Without this the map grows unbounded under key churn.
setInterval(() => {
  const now = Date.now();
  for (const [id, win] of windows) {
    if (now > win.resetAt + WINDOW_MS) windows.delete(id);
  }
}, 300_000).unref();
