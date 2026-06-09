import { describe, it, expect } from "vitest";
import {
  ElgonError,
  NetworkError,
  TimeoutError,
  ReceiptVerificationError,
} from "../errors";

describe("ElgonError", () => {
  it("has name and code", () => {
    const err = new ElgonError("test", "TEST");
    expect(err.name).toBe("ElgonError");
    expect(err.code).toBe("TEST");
    expect(err.message).toBe("test");
  });

  it("is instanceof Error", () => {
    expect(new ElgonError("x", "X")).toBeInstanceOf(Error);
  });
});

describe("NetworkError", () => {
  it("includes status code", () => {
    const err = new NetworkError("bad gateway", 502);
    expect(err.statusCode).toBe(502);
    expect(err.code).toBe("NETWORK_ERROR");
  });

  it("works without status code", () => {
    const err = new NetworkError("dns failed");
    expect(err.statusCode).toBeUndefined();
  });
});

describe("TimeoutError", () => {
  it("includes timeout duration", () => {
    const err = new TimeoutError(5000);
    expect(err.message).toContain("5000");
    expect(err.code).toBe("TIMEOUT");
  });
});

describe("ReceiptVerificationError", () => {
  it("wraps reason", () => {
    const err = new ReceiptVerificationError("bad signature");
    expect(err.message).toContain("bad signature");
    expect(err.code).toBe("RECEIPT_INVALID");
  });
});
