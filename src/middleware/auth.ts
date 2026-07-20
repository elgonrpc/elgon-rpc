import { Request, Response, NextFunction } from "express";
import { supabase, isConfigured } from "../lib/db";
import { logger } from "../lib/logger";

const SANDBOX_KEY = "elgon_sandbox_pub";
const LIMITS: Record<string, number> = { sandbox: 20, free: 60, growth: 600 };

function extractKey(req: Request): string {
  return (
    String(req.query.key || "") ||
    String(req.headers["x-api-key"] || "") ||
    String(req.headers.authorization || "").replace(/^Bearer /, "")
  );
}

export async function validateApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  const key = extractKey(req);

  if (!key) {
    res.status(401).json({ error: "API key required. Get one at https://elgonrpc.xyz/dashboard" });
    return;
  }

  if (key === SANDBOX_KEY) {
    res.locals.plan = "sandbox";
    res.locals.rateLimit = LIMITS.sandbox;
    return next();
  }

  if (!key.startsWith("elgon_")) {
    res.status(401).json({ error: "Invalid key format" });
    return;
  }

  if (!isConfigured()) {
    res.status(503).json({ error: "Key validation unavailable" });
    return;
  }

  try {
    const { data, error } = await supabase.rpc("validate_api_key", { input_key: key });

    // validate_api_key returns a (user_id, plan) row with no boolean flag — the
    // presence of a plan string is what marks the key as good.
    if (error || !data || typeof data.plan !== "string") {
      res.status(401).json({ error: "Invalid API key" });
      return;
    }

    res.locals.plan = data.plan;
    res.locals.userId = data.user_id ?? null;
    res.locals.rateLimit = LIMITS[data.plan] ?? LIMITS.free;
    next();
  } catch (err) {
    logger.error("key validation failed", { error: String(err) });
    res.status(500).json({ error: "Internal error" });
  }
}
