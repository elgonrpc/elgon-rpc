import { Router, Request, Response } from "express";
import { getQuote } from "../providers/yahoo";
import { buildChain } from "../providers/options";
import { validateApiKey } from "../middleware/auth";
import { makeReceipt } from "../lib/receipt";

export const optionsRouter = Router();

optionsRouter.get("/:symbol", validateApiKey, async (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();

  // Anchor the chain to the live underlying — using a cached price drifts the
  // strikes away from the market within a session.
  const underlying = await getQuote(symbol);
  if (!underlying) {
    return res.status(404).json({ error: `Symbol not found: ${symbol}` });
  }

  const data = buildChain(underlying);
  res.json({
    data,
    source: "sandbox",
    plan: res.locals.plan,
    receipt: makeReceipt(data, `/api/v1/options/${symbol}`),
  });
});
