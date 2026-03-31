import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/db";
import { logger } from "../lib/logger";

const SANDBOX_KEY = "elgon_sandbox_pub";

export async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const key =
    (req.query.key as string) ||
    (req.headers["x-api-key"] as string) ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!key) {
    res.status(401).json({ error: "API key required. Get one at elgonrpc.xyz/dashboard" });
    return;
  }

  if (key === SANDBOX_KEY) {
    (req as any).plan = "sandbox";
    (req as any).rateLimit = 20;
    return next();
  }

  if (!key.startsWith("elgon_")) {
    res.status(401).json({ error: "Invalid key format" });
    return;
  }

  try {
    const { data, error } = await supabase.rpc("validate_api_key", {
      input_key: key,
    });

    if (error) {
      logger.warn("Key validation RPC error", { error: error.message });
      res.status(500).json({ error: "Validation service unavailable" });
      return;
    }

    if (!data || (typeof data.plan !== "string")) {
      res.status(401).json({ error: "Invalid API key" });
      return;
    }

    (req as any).plan = data.plan;
    (req as any).rateLimit = data.plan === "growth" ? 600 : 60;
    (req as any).userId = data.user_id || null;
    next();
  } catch (err) {
    logger.error("Key validation error", { error: String(err) });
    res.status(500).json({ error: "Internal error" });
  }
}
