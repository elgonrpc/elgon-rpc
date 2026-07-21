import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const sample = {
  symbol: "AAPL", name: "Apple Inc.", price: 234.56, change: 2.31, changePct: 0.99,
  volume: 52_340_000, currency: "USD", assetClass: "stock", asOf: new Date().toISOString(),
};

vi.mock("../src/providers/yahoo", () => ({
  getQuote: vi.fn(async (s: string) => (s === "NOPE" ? null : { ...sample, symbol: s })),
  getBatchQuotes: vi.fn(async (syms: string[]) => syms.map((s) => ({ ...sample, symbol: s }))),
  searchSymbols: vi.fn(async () => []),
}));

vi.mock("../src/middleware/auth", () => ({
  validateApiKey: (_req: unknown, res: { locals: Record<string, unknown> }, next: () => void) => {
    res.locals.plan = "free";
    next();
  },
}));

const { app } = await import("../src/index");

describe("GET /api/v1/quotes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects a request with no symbols", async () => {
    const res = await request(app).get("/api/v1/quotes");
    expect(res.status).toBe(400);
  });

  it("returns a quote with a receipt", async () => {
    const res = await request(app).get("/api/v1/quotes?symbols=AAPL");
    expect(res.status).toBe(200);
    expect(res.body.data[0].symbol).toBe("AAPL");
    expect(res.body.receipt.alg).toBe("sha256");
    expect(res.body.receipt.hash).toHaveLength(64);
  });

  it("caps the batch at 20 symbols", async () => {
    const many = Array.from({ length: 21 }, (_, i) => `S${i}`).join(",");
    const res = await request(app).get(`/api/v1/quotes?symbols=${many}`);
    expect(res.status).toBe(400);
  });

  it("404s when the upstream has nothing", async () => {
    const res = await request(app).get("/api/v1/quotes?symbols=NOPE");
    expect(res.status).toBe(404);
  });
});
