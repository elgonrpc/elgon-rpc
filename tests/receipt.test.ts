import { describe, it, expect } from "vitest";
import { makeReceipt } from "../src/lib/receipt";

describe("receipt", () => {
  it("is stable for identical payloads", () => {
    const a = makeReceipt({ x: 1 }, "/api/v1/quotes");
    const b = makeReceipt({ x: 1 }, "/api/v1/quotes");
    expect(a.hash).toBe(b.hash);
  });

  it("changes when the payload changes", () => {
    const a = makeReceipt({ x: 1 }, "/api/v1/quotes");
    const b = makeReceipt({ x: 2 }, "/api/v1/quotes");
    expect(a.hash).not.toBe(b.hash);
  });

  it("emits a sha256 digest and the endpoint it covers", () => {
    const r = makeReceipt({ x: 1 }, "/api/v1/movers");
    expect(r.alg).toBe("sha256");
    expect(r.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(r.endpoint).toBe("/api/v1/movers");
  });
});
