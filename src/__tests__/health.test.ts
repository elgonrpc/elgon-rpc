import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkHealth } from "../health";

describe("checkHealth", () => {
  beforeEach(() => {
    vi.stubGlobal("performance", { now: vi.fn().mockReturnValue(0) });
  });

  it("returns ok on 200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ slot: 300000000, version: "0.2.0" }),
    }));
    const status = await checkHealth("https://rpc.elgonrpc.xyz");
    expect(status.ok).toBe(true);
    expect(status.slot).toBe(300000000);
  });

  it("returns not ok on 503", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    const status = await checkHealth("https://rpc.elgonrpc.xyz");
    expect(status.ok).toBe(false);
  });

  it("returns not ok on network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("dns")));
    const status = await checkHealth("https://rpc.elgonrpc.xyz");
    expect(status.ok).toBe(false);
  });
});
