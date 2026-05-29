import { Router, Request, Response } from "express";
import { SnapTradeClient } from "../providers/snaptrade";
import { logger } from "../lib/logger";

export const connectRouter = Router();

const st = new SnapTradeClient();

connectRouter.get("/session", (_req: Request, res: Response) => {
  res.json({
    demo: !st.isConfigured(),
    broker: "Robinhood",
  });
});

connectRouter.post("/session", async (req: Request, res: Response) => {
  if (!st.isConfigured()) {
    return res.json({
      url: null,
      demo: true,
      message: "Brokerage connect is in demo mode",
    });
  }

  try {
    const userId = await st.register();
    const url = await st.getLoginUrl(userId);
    res.json({ url, demo: false });
  } catch (err) {
    logger.error("SnapTrade session error", { error: String(err) });
    res.status(500).json({ error: "Failed to create connection session" });
  }
});

// handle duplicate events idempotently

// add type-check step
