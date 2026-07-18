import { logger } from "../lib/logger";
import type { Quote } from "../types";

const KEY = process.env.FINNHUB_API_KEY || "";

/** Optional licensed fallback. Inactive unless FINNHUB_API_KEY is set. */
export function isEnabled(): boolean {
  return Boolean(KEY);
}

export async function getQuote(symbol: string): Promise<Quote | null> {
  if (!KEY) return null;
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${KEY}`);
    if (!res.ok) return null;
    const d = (await res.json()) as { c?: number; d?: number; dp?: number };
    if (!d.c) return null;

    return {
      symbol,
      name: symbol,
      price: d.c,
      change: d.d ?? 0,
      changePct: d.dp ?? 0,
      volume: 0,
      currency: "USD",
      assetClass: "stock",
      asOf: new Date().toISOString(),
    };
  } catch (err) {
    logger.warn(`finnhub failed: ${symbol}`, { error: String(err) });
    return null;
  }
}
