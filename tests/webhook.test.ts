import { describe, it, expect } from "vitest";
import crypto from "crypto";

function sign(payload: string, secret: string, ts: number): string {
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${ts}.${payload}`)
    .digest("hex");
  return `t=${ts},v1=${sig}`;
}

describe("Webhook signature", () => {
  const secret = "whsec_test_secret";

  it("validates correct signature", () => {
    const payload = JSON.stringify({ type: "checkout.session.completed" });
    const ts = Math.floor(Date.now() / 1000);
    const header = sign(payload, secret, ts);

    const parts = header.split(",").reduce((acc, p) => {
      const [k, v] = p.split("=");
      acc[k] = v;
      return acc;
    }, {} as Record<string, string>);

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${parts.t}.${payload}`)
      .digest("hex");

    expect(parts.v1).toBe(expected);
  });

  it("rejects tampered payload", () => {
    const payload = JSON.stringify({ type: "checkout.session.completed" });
    const ts = Math.floor(Date.now() / 1000);
    const header = sign(payload, secret, ts);
    const tampered = payload.replace("completed", "failed");

    const parts = header.split(",").reduce((acc, p) => {
      const [k, v] = p.split("=");
      acc[k] = v;
      return acc;
    }, {} as Record<string, string>);

    const check = crypto
      .createHmac("sha256", secret)
      .update(`${parts.t}.${tampered}`)
      .digest("hex");

    expect(check).not.toBe(parts.v1);
  });
});
