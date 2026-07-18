import yahooFinance from "yahoo-finance2";
import { logger } from "../lib/logger";
import type { Quote, SearchResult, AssetClass } from "../types";

/**
 * Yahoo reports crypto and ETFs with their own quoteType; without this they all
 * collapse into "stock" and BTC-USD ends up labelled an equity.
 */
function classify(symbol: string, raw: { quoteType?: string }): AssetClass {
  const t = (raw.quoteType || "").toUpperCase();
  if (t === "CRYPTOCURRENCY" || symbol.endsWith("-USD")) return "crypto";
  if (t === "ETF") return "etf";
  if (t === "INDEX") return "index";
  return "stock";
}

export async function getQuote(symbol: string): Promise<Quote | null> {
  try {
    const q = await yahooFinance.quote(symbol);
    if (!q || typeof q.regularMarketPrice !== "number") return null;

    const price = q.regularMarketPrice;
    return {
      symbol: q.symbol || symbol,
      name: q.shortName || q.longName || symbol,
      price,
      change: q.regularMarketChange ?? 0,
      changePct: q.regularMarketChangePercent ?? 0,
      bid: q.bid ?? undefined,
      ask: q.ask ?? undefined,
      volume: q.regularMarketVolume ?? 0,
      marketCap: q.marketCap ?? null,
      currency: q.currency || "USD",
      assetClass: classify(symbol, q),
      asOf: new Date().toISOString(),
    };
  } catch (err) {
    logger.warn(`quote failed: ${symbol}`, { error: String(err) });
    return null;
  }
}

export async function getBatchQuotes(symbols: string[]): Promise<Quote[]> {
  const settled = await Promise.allSettled(symbols.map(getQuote));
  return settled
    .filter((r): r is PromiseFulfilledResult<Quote | null> => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((q): q is Quote => q !== null);
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  try {
    const res = await yahooFinance.search(query);
    return (res.quotes || [])
      .filter((q: { symbol?: string }) => Boolean(q.symbol))
      .slice(0, 10)
      .map((q: { symbol: string; shortname?: string; longname?: string; exchange?: string; quoteType?: string }) => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        exchange: q.exchange || "",
        assetClass: classify(q.symbol, q),
      }));
  } catch (err) {
    logger.warn(`search failed: ${query}`, { error: String(err) });
    return [];
  }
}
