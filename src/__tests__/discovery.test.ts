import { describe, it, expect, vi, beforeEach } from "vitest";
import { discoverNodes, closestNode } from "../discovery";

const MOCK_NODES = {
  nodes: [
    { id: "us-east-1", region: "us-east", pubkey: "node1pub" },
    { id: "eu-west-1", region: "eu-west", pubkey: "node2pub" },
  ],
};

describe("discoverNodes", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_NODES),
    }));
  });

  it("returns node list", async () => {
    const nodes = await discoverNodes("https://rpc.elgonrpc.xyz");
    expect(nodes).toHaveLength(2);
    expect(nodes[0].id).toBe("us-east-1");
  });

  it("throws NetworkError on failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(discoverNodes("https://rpc.elgonrpc.xyz")).rejects.toThrow("503");
  });
});

describe("closestNode", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_NODES),
    }));
    vi.stubGlobal("performance", { now: vi.fn().mockReturnValue(0) });
  });

  it("returns a node", async () => {
    const node = await closestNode("https://rpc.elgonrpc.xyz");
    expect(node).not.toBeNull();
    expect(node!.id).toBeDefined();
  });
});
