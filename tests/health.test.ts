import { describe, it, expect, vi } from "vitest";
import request from "supertest";

vi.mock("../src/providers/yahoo", () => ({
  getQuote: vi.fn(), getBatchQuotes: vi.fn(async () => []), searchSymbols: vi.fn(async () => []),
}));

const { app } = await import("../src/index");

describe("GET /api/health", () => {
  it("reports ok without a key", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(typeof res.body.uptime).toBe("number");
  });
});
