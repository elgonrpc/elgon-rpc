import { Router, Request, Response } from "express";
import { validateApiKey } from "../middleware/auth";
import { makeReceipt } from "../lib/receipt";
import type { PredictionMarket } from "../types";

export const predictionsRouter = Router();

/** Sandbox event contracts. Prices are simulated, not a live orderbook. */
const MARKETS: PredictionMarket[] = [
  { id: "fed-sep-cut", question: "Fed cuts rates in September?", category: "macro", yes: 0.6, no: 0.4 },
  { id: "spx-6000-eoy", question: "S&P 500 closes above 6000 by year end?", category: "equities", yes: 0.49, no: 0.51 },
  { id: "btc-100k-q4", question: "Bitcoin above $100k in Q4?", category: "crypto", yes: 0.32, no: 0.68 },
  { id: "cpi-below-3", question: "US CPI below 3% next print?", category: "macro", yes: 0.55, no: 0.45 },
  { id: "nvda-beat", question: "NVDA beats EPS estimate?", category: "equities", yes: 0.71, no: 0.29 },
];

predictionsRouter.get("/", validateApiKey, (_req: Request, res: Response) => {
  res.json({
    data: MARKETS,
    source: "sandbox",
    plan: res.locals.plan,
    receipt: makeReceipt(MARKETS, "/api/v1/predictions"),
  });
});
