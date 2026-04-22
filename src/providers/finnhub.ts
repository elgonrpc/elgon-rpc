import { logger } from "../lib/logger";
import type { Quote } from "../types";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || "";

export async function getQuoteFinnhub(symbol: string): Promise<Quote | null> {
  if (!FINNHUB_KEY) return null;

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`,
    );
    const data = await res.json();

    if (!data || !data.c) return null;

    return {
      symbol,
      price: data.c,
      change: data.d ?? 0,
      changePct: data.dp ?? 0,
      volume: 0,
      marketCap: null,
      name: symbol,
      assetClass: "stock",
      timestamp: Date.now(),
    };
  } catch (err) {
    logger.warn(`Finnhub fetch failed: ${symbol}`, { error: String(err) });
    return null;
  }
}

// update README with full feature list
