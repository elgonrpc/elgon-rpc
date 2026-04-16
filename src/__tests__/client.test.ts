import { describe, it, expect, vi, beforeEach } from "vitest";
import { ElgonClient } from "../index";

const MOCK_ANSWER = {
  answer: "5000000000",
  slot: 302000000,
  receipt: {
    node: "elgon1qtest",
    stateCommitment: "0xaa",
    sig: "0xbb",
  },
};

describe("ElgonClient", () => {
  let client: ElgonClient;

  beforeEach(() => {
    client = new ElgonClient({ endpoint: "https://rpc.elgonrpc.xyz" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_ANSWER),
    }));
  });

  it("constructs without token", () => {
    expect(client).toBeDefined();
  });

  it("getBalance sends correct method", async () => {
    const res = await client.getBalance("So111");
    expect(res.answer).toBe("5000000000");
    expect(fetch).toHaveBeenCalledTimes(1);
    const body = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(body.method).toBe("getBalance");
  });

  it("getSlot sends empty params", async () => {
    await client.getSlot();
    const body = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(body.params).toEqual([]);
  });

  it("throws NetworkError on HTTP 500", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(client.getBalance("x")).rejects.toThrow("HTTP 500");
  });
});
