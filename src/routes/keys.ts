import { Router, Request, Response } from "express";
import crypto from "crypto";
import { supabase } from "../lib/db";
import { logger } from "../lib/logger";

export const keysRouter = Router();

const mintWindows = new Map<string, number[]>();
const MAX_KEYS_PER_HOUR = 5;

keysRouter.post("/", async (req: Request, res: Response) => {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const cutoff = now - 3600_000;

  let stamps = mintWindows.get(ip) || [];
  stamps = stamps.filter((t) => t > cutoff);

  if (stamps.length >= MAX_KEYS_PER_HOUR) {
    return res.status(429).json({ error: "Too many keys minted. Try again later." });
  }

  const key = "elgon_live_" + crypto.randomBytes(16).toString("hex");

  try {
    const { error } = await supabase.from("api_keys").insert({
      key,
      plan: "free",
      rate_limit: 60,
    });

    if (error) {
      logger.error("Key mint failed", { error: error.message });
      return res.status(500).json({ error: "Failed to create key" });
    }

    stamps.push(now);
    mintWindows.set(ip, stamps);

    res.json({ key, plan: "free", rateLimit: 60 });
  } catch (err) {
    res.status(500).json({ error: "Internal error" });
  }
});
