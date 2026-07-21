import { describe, it, expect } from "vitest";
import { buildChain } from "../src/providers/options";
import type { Quote } from "../src/types";

const underlying: Quote = {
  symbol: "AAPL", name: "Apple Inc.", price: 334.2, change: 1.1, changePct: 0.33,
  volume: 1000, currency: "USD", assetClass: "stock", asOf: new Date().toISOString(),
};

describe("options chain", () => {
  it("anchors strikes around the live price", () => {
    const { chain } = buildChain(underlying);
    const strikes = [...new Set(chain.map((c) => c.strike))];
    const nearest = strikes.reduce((a, b) =>
      Math.abs(b - underlying.price) < Math.abs(a - underlying.price) ? b : a);
    expect(Math.abs(nearest - underlying.price)).toBeLessThan(5);
  });

  it("quotes calls and puts for every expiry", () => {
    const { chain, expirations } = buildChain(underlying);
    for (const e of expirations) {
      const slice = chain.filter((c) => c.expiry === e);
      expect(slice.some((c) => c.type === "call")).toBe(true);
      expect(slice.some((c) => c.type === "put")).toBe(true);
    }
  });

  it("never quotes an ask below the bid", () => {
    const { chain } = buildChain(underlying);
    expect(chain.every((c) => c.ask >= c.bid)).toBe(true);
  });

  it("keeps implied volatility in a sane range", () => {
    const { chain } = buildChain(underlying);
    expect(chain.every((c) => c.iv > 0 && c.iv < 1.5)).toBe(true);
  });
});
