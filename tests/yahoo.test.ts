import { describe, it, expect, vi } from "vitest";

vi.mock("yahoo-finance2", () => ({
  default: {
    quote: vi.fn().mockResolvedValue({
      symbol: "AAPL",
      regularMarketPrice: 234.56,
      regularMarketChange: 2.31,
      regularMarketChangePercent: 0.99,
      regularMarketVolume: 52340000,
      marketCap: 3600000000000,
      shortName: "Apple Inc.",
      quoteType: "EQUITY",
    }),
    search: vi.fn().mockResolvedValue({
      quotes: [
        { symbol: "TSLA", shortname: "Tesla Inc.", exchange: "NMS", quoteType: "EQUITY" },
      ],
    }),
  },
}));

import { getQuote, searchSymbols } from "../src/providers/yahoo";

describe("Yahoo adapter", () => {
  it("fetches a quote", async () => {
    const q = await getQuote("AAPL");
    expect(q).not.toBeNull();
    expect(q!.price).toBe(234.56);
    expect(q!.assetClass).toBe("stock");
  });

  it("infers crypto assetClass", async () => {
    const { default: yf } = await import("yahoo-finance2");
    (yf.quote as any).mockResolvedValueOnce({
      symbol: "BTC-USD",
      regularMarketPrice: 67000,
      regularMarketChange: 1200,
      regularMarketChangePercent: 1.8,
      quoteType: "CRYPTOCURRENCY",
    });

    const q = await getQuote("BTC-USD");
    expect(q!.assetClass).toBe("crypto");
  });

  it("searches symbols", async () => {
    const results = await searchSymbols("tesla");
    expect(results).toHaveLength(1);
    expect(results[0].symbol).toBe("TSLA");
  });
});
