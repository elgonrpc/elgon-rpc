import crypto from "crypto";
import type { Receipt } from "../types";

const VERIFY_URL = "https://elgonrpc.xyz/api/v1/verify";

/**
 * Hash the exact payload we are about to return. The client can recompute this
 * over the response body and confirm nothing was altered in transit.
 */
export function makeReceipt(payload: unknown, endpoint: string): Receipt {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");

  return { alg: "sha256", hash, ts: new Date().toISOString(), endpoint, verifyUrl: VERIFY_URL };
}
