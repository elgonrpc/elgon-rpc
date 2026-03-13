import { Router, Request, Response } from "express";
import { getQuote, getBatchQuotes } from "../providers/yahoo";
import { validateApiKey } from "../middleware/auth";

export const quotesRouter = Router();

quotesRouter.get("/", validateApiKey, async (req: Request, res: Response) => {
  const symbolsParam = (req.query.symbols as string) || "";
  const symbols = symbolsParam
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  if (symbols.length === 0) {
    return res.status(400).json({ error: "Missing ?symbols parameter" });
  }

  if (symbols.length > 20) {
    return res.status(400).json({ error: "Max 20 symbols per request" });
  }

  try {
    const quotes = symbols.length === 1
      ? [await getQuote(symbols[0])].filter(Boolean)
      : await getBatchQuotes(symbols);

    res.json({
      data: quotes,
      meta: { count: quotes.length, delayed: true },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
});
