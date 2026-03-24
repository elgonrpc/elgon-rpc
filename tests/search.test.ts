import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../src/index";

vi.mock("../src/providers/yahoo", () => ({
  searchSymbols: vi.fn().mockResolvedValue([
    { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", assetClass: "stock" },
  ]),
}));

vi.mock("../src/middleware/auth", () => ({
  validateApiKey: (_req: any, _res: any, next: any) => next(),
}));

describe("GET /api/v1/search", () => {
  it("returns 400 without query", async () => {
    const res = await request(app).get("/api/v1/search");
    expect(res.status).toBe(400);
  });

  it("returns results for valid query", async () => {
    const res = await request(app).get("/api/v1/search?q=tesla");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].symbol).toBe("TSLA");
  });
});
