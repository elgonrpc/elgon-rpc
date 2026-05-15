import { Router, Request, Response } from "express";
import { getQuote } from "../providers/yahoo";

export const demoRouter = Router();

demoRouter.get("/", async (_req: Request, res: Response) => {
  const symbols = ["AAPL", "TSLA", "BTC-USD", "ETH-USD"];

  try {
    const quotes = await Promise.all(symbols.map(getQuote));
    const valid = quotes.filter(Boolean);

    const rows = valid
      .map((q) => {
        const color = q!.change >= 0 ? "#22c55e" : "#ef4444";
        const arrow = q!.change >= 0 ? "+" : "";
        return `<tr>
          <td>${q!.symbol}</td>
          <td>$${q!.price.toFixed(2)}</td>
          <td style="color:${color}">${arrow}${q!.changePct.toFixed(2)}%</td>
        </tr>`;
      })
      .join("");

    res.setHeader("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Elgon Demo</title>
<style>
  body{margin:0;background:#0a0a0a;color:#f5f5f5;font-family:system-ui}
  table{width:100%;border-collapse:collapse}
  td{padding:8px 12px;border-bottom:1px solid #222}
  .note{color:#888;font-size:12px;padding:12px}
</style></head><body>
<table>${rows}</table>
<div class="note">Live quotes, delayed — not real-time. Do not trade on it.</div>
</body></html>`);
  } catch (err) {
    res.status(500).send("Demo unavailable");
  }
});

// add architecture overview
