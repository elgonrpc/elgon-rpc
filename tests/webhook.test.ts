import { describe, it, expect } from "vitest";
import crypto from "crypto";

const SECRET = "whsec_test";

function sign(payload: string, ts: number, secret = SECRET) {
  return crypto.createHmac("sha256", secret).update(`${ts}.${payload}`).digest("hex");
}

describe("stripe webhook signature", () => {
  const payload = JSON.stringify({ type: "checkout.session.completed" });
  const ts = 1_700_000_000;

  it("accepts a signature over the exact payload", () => {
    expect(sign(payload, ts)).toBe(sign(payload, ts));
  });

  it("rejects a tampered payload", () => {
    const tampered = payload.replace("completed", "failed");
    expect(sign(tampered, ts)).not.toBe(sign(payload, ts));
  });

  it("rejects a signature made with another secret", () => {
    expect(sign(payload, ts, "whsec_other")).not.toBe(sign(payload, ts));
  });
});
