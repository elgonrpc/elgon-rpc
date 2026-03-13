import yahooFinance from "yahoo-finance2";
import { logger } from "../lib/logger";
import type { Quote, SearchResult, AssetClass } from "../types";

function inferAssetClass(sym: string, data: any): AssetClass {
  if (data?.quoteType === "CRYPTOCURRENCY" || sym.endsWith("-USD")) return "crypto";
  if (data?.quoteType === "ETF") return "etf";
  if (data?.quoteType === "INDEX") return "index";
  return "stock";
}

export async function getQuote(symbol: string): Promise<Quote | null> {
  try {
    const data = await yahooFinance.quote(symbol);
    if (!data || !data.regularMarketPrice) return null;

    return {
      symbol: data.symbol,
      price: data.regularMarketPrice,
      change: data.regularMarketChange ?? 0,
      changePct: data.regularMarketChangePercent ?? 0,
      volume: data.regularMarketVolume ?? 0,
      marketCap: data.marketCap ?? null,
      name: data.shortName || data.longName || symbol,
      assetClass: inferAssetClass(symbol, data),
      timestamp: Date.now(),
    };
  } catch (err) {
    logger.warn(`Quote fetch failed: ${symbol}`, { error: String(err) });
    return null;
  }
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  try {
    const results = await yahooFinance.search(query);
    return (results.quotes || [])
      .filter((q: any) => q.symbol)
      .slice(0, 10)
      .map((q: any) => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        exchange: q.exchange || "",
        assetClass: inferAssetClass(q.symbol, q),
      }));
  } catch (err) {
    logger.warn(`Search failed: ${query}`, { error: String(err) });
    return [];
  }
}

export async function getBatchQuotes(symbols: string[]): Promise<Quote[]> {
  const results = await Promise.allSettled(symbols.map(getQuote));
  return results
    .filter((r): r is PromiseFulfilledResult<Quote | null> => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((q): q is Quote => q !== null);
}
