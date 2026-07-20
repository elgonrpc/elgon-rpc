import { Router, Request, Response } from "express";
import crypto from "crypto";
import { supabase, isConfigured } from "../lib/db";
import { logger } from "../lib/logger";

export const keysRouter = Router();

const MAX_PER_HOUR = 5;
const HOUR_MS = 3_600_000;
const mints = new Map<string, number[]>();

/** Anonymous key minting — no email, no signup. Best-effort per-IP throttle. */
keysRouter.post("/", async (req: Request, res: Response) => {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const recent = (mints.get(ip) || []).filter((t) => t > now - HOUR_MS);

  if (recent.length >= MAX_PER_HOUR) {
    return res.status(429).json({ error: "Too many keys minted. Try again later." });
  }

  if (!isConfigured()) {
    return res.status(503).json({ error: "Key service unavailable" });
  }

  const key = "elgon_live_" + crypto.randomBytes(16).toString("hex");
  const { error } = await supabase.from("api_keys").insert({ key, plan: "free", rate_limit: 60 });

  if (error) {
    logger.error("key mint failed", { error: error.message });
    return res.status(500).json({ error: "Failed to create key" });
  }

  recent.push(now);
  mints.set(ip, recent);

  res.json({ key, plan: "free", rateLimit: 60, createdAt: new Date().toISOString() });
});
