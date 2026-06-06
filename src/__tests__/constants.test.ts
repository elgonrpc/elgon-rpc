import { describe, it, expect } from "vitest";
import { DEFAULT_ENDPOINT, DEFAULT_TIMEOUT_MS, MAX_SLOT_DRIFT, SDK_VERSION } from "../constants";

describe("constants", () => {
  it("has correct default endpoint", () => {
    expect(DEFAULT_ENDPOINT).toBe("https://rpc.elgonrpc.xyz");
  });

  it("has 30s default timeout", () => {
    expect(DEFAULT_TIMEOUT_MS).toBe(30_000);
  });

  it("has reasonable slot drift", () => {
    expect(MAX_SLOT_DRIFT).toBe(150);
  });

  it("exports SDK version", () => {
    expect(SDK_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
