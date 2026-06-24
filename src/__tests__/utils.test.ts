import { describe, it, expect } from "vitest";
import { chunks, abbreviateAddress, lamportsToSol, solToLamports } from "../utils";

describe("chunks", () => {
  it("splits array into chunks", () => {
    expect(chunks([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("handles empty array", () => {
    expect(chunks([], 3)).toEqual([]);
  });

  it("handles chunk size larger than array", () => {
    expect(chunks([1, 2], 5)).toEqual([[1, 2]]);
  });
});

describe("abbreviateAddress", () => {
  it("abbreviates long addresses", () => {
    const addr = "So11111111111111111111111111111111111111112";
    expect(abbreviateAddress(addr)).toBe("So11...1112");
  });

  it("returns short strings unchanged", () => {
    expect(abbreviateAddress("abc")).toBe("abc");
  });
});

describe("lamportsToSol", () => {
  it("converts lamports to SOL", () => {
    expect(lamportsToSol("1000000000")).toBe(1);
    expect(lamportsToSol(500000000)).toBe(0.5);
  });
});

describe("solToLamports", () => {
  it("converts SOL to lamports", () => {
    expect(solToLamports(1)).toBe(1000000000n);
    expect(solToLamports(0.5)).toBe(500000000n);
  });
});
