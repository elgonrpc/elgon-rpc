import { Router, Request, Response } from "express";
import { getBatchQuotes } from "../providers/yahoo";
import { validateApiKey } from "../middleware/auth";
import { makeReceipt } from "../lib/receipt";

export const moversRouter = Router();

/** Large caps the Robinhood surface actually surfaces, ranked by session move. */
const UNIVERSE = [
  "AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "GOOGL", "META",
  "AMD", "NFLX", "COIN", "HOOD", "SPY", "QQQ",
];

moversRouter.get("/", validateApiKey, async (_req: Request, res: Response) => {
  const quotes = await getBatchQuotes(UNIVERSE);
  const ranked = [...quotes].sort((a, b) => b.changePct - a.changePct);

  const data = {
    gainers: ranked.filter((q) => q.changePct > 0).slice(0, 5),
    losers: ranked.filter((q) => q.changePct < 0).reverse().slice(0, 5),
  };

  res.json({
    data,
    source: "live",
    plan: res.locals.plan,
    receipt: makeReceipt(data, "/api/v1/movers"),
  });
});
