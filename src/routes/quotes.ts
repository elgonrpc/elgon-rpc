import { Router, Request, Response } from "express";
import { getQuote, getBatchQuotes } from "../providers/yahoo";
import { validateApiKey } from "../middleware/auth";
import { makeReceipt } from "../lib/receipt";

export const quotesRouter = Router();

const MAX_SYMBOLS = 20;

quotesRouter.get("/", validateApiKey, async (req: Request, res: Response) => {
  const symbols = String(req.query.symbols || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  if (!symbols.length) {
    return res.status(400).json({ error: "Missing ?symbols parameter" });
  }
  if (symbols.length > MAX_SYMBOLS) {
    return res.status(400).json({ error: `Max ${MAX_SYMBOLS} symbols per request` });
  }

  const data =
    symbols.length === 1
      ? [await getQuote(symbols[0])].filter(Boolean)
      : await getBatchQuotes(symbols);

  if (!data.length) {
    return res.status(404).json({ error: `No data for: ${symbols.join(", ")}` });
  }

  res.json({
    data,
    source: "live",
    plan: res.locals.plan,
    receipt: makeReceipt(data, "/api/v1/quotes"),
  });
});
