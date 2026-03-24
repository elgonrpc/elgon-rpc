import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../src/index";

vi.mock("../src/providers/yahoo", () => ({
  getQuote: vi.fn().mockResolvedValue({
    symbol: "AAPL",
    price: 234.56,
    change: 2.31,
    changePct: 0.99,
    volume: 52340000,
    marketCap: 3600000000000,
    name: "Apple Inc.",
    assetClass: "stock",
    timestamp: Date.now(),
  }),
  getBatchQuotes: vi.fn().mockResolvedValue([]),
}));

vi.mock("../src/middleware/auth", () => ({
  validateApiKey: (_req: any, _res: any, next: any) => next(),
}));

describe("GET /api/v1/quotes", () => {
  it("returns 400 without symbols param", async () => {
    const res = await request(app).get("/api/v1/quotes");
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("symbols");
  });

  it("returns quote for single symbol", async () => {
    const res = await request(app).get("/api/v1/quotes?symbols=AAPL");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].symbol).toBe("AAPL");
    expect(res.body.meta.delayed).toBe(true);
  });

  it("rejects more than 20 symbols", async () => {
    const syms = Array.from({ length: 21 }, (_, i) => `SYM${i}`).join(",");
    const res = await request(app).get(`/api/v1/quotes?symbols=${syms}`);
    expect(res.status).toBe(400);
  });
});
