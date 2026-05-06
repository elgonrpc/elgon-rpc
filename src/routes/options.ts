import { Router, Request, Response } from "express";
import { getQuote } from "../providers/yahoo";
import { validateApiKey } from "../middleware/auth";
import { generateOptionsChain } from "../providers/options";

export const optionsRouter = Router();

optionsRouter.get("/:symbol", validateApiKey, async (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const underlying = await getQuote(symbol);
    if (!underlying) {
      return res.status(404).json({ error: `Symbol not found: ${symbol}` });
    }

    const chain = generateOptionsChain(underlying);
    res.json({
      data: chain,
      meta: { symbol, delayed: true, simulated: true },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate options chain" });
  }
});

// add troubleshooting section
