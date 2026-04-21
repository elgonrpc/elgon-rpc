import { Router, Request, Response } from "express";
import { validateApiKey } from "../middleware/auth";

export const predictionsRouter = Router();

const MOCK_MARKETS = [
  { id: "fed-rate-jul", question: "Will the Fed cut rates in July 2026?", yes: 0.62, volume: 184000 },
  { id: "btc-100k-q3", question: "Will BTC hit $100k by Q3 2026?", yes: 0.41, volume: 2340000 },
  { id: "aapl-earnings", question: "Will AAPL beat Q3 earnings estimates?", yes: 0.73, volume: 520000 },
  { id: "recession-2026", question: "US recession declared by end of 2026?", yes: 0.18, volume: 890000 },
];

predictionsRouter.get("/", validateApiKey, (_req: Request, res: Response) => {
  res.json({
    data: MOCK_MARKETS,
    meta: { count: MOCK_MARKETS.length, simulated: true },
  });
});

// prune stale entries to prevent memory growth
