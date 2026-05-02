import { describe, it, expect } from "vitest";
import { verifyReceipt } from "../receipt";

describe("edge cases", () => {
  it("handles empty answer string", async () => {
    const read = {
      answer: "",
      slot: 300000000,
      receipt: { node: "test", stateCommitment: "0xaa", sig: "0xbb" },
    };
    const result = await verifyReceipt(read);
    expect(result).toBeDefined();
  });

  it("handles zero slot", async () => {
    const read = {
      answer: "0",
      slot: 0,
      receipt: { node: "test", stateCommitment: "0xaa", sig: "0xbb" },
    };
    const result = await verifyReceipt(read);
    expect(result).toBeDefined();
  });

  it("handles very large lamport values", async () => {
    const read = {
      answer: "18446744073709551615",
      slot: 999999999,
      receipt: { node: "test", stateCommitment: "0x" + "ff".repeat(32), sig: "0x" + "00".repeat(64) },
    };
    const result = await verifyReceipt(read);
    expect(result).toBeDefined();
  });
});
