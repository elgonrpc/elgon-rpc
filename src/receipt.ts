/**
 * Proof-of-serve receipt verification.
 *
 * A receipt binds `(answer, slot, stateCommitment)` under a bonded node's ed25519 key.
 * The canonical digest is:
 *
 *     sha256( utf8(answer) ‖ 0x00 ‖ le64(slot) ‖ 0x00 ‖ hex→bytes(stateCommitment) )
 *
 * See docs/receipts.md for the byte layout and rationale.
 */
import { sha256 } from "@noble/hashes/sha256";
import { verify as ed25519Verify } from "@noble/ed25519";
import bs58 from "bs58";
import type { Answer, Receipt } from "./types";

function hexToBytes(hex: string): Uint8Array {
  const h = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (h.length % 2 !== 0) throw new Error("odd-length hex");
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function le64(n: number): Uint8Array {
  const b = new Uint8Array(8);
  let v = BigInt(n);
  for (let i = 0; i < 8; i++) {
    b[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return b;
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const len = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

/** Recompute the canonical digest a receipt signs over. */
export function receiptDigest(answer: string, slot: number, stateCommitment: string): Uint8Array {
  const sep = new Uint8Array([0x00]);
  return sha256(
    concat(new TextEncoder().encode(answer), sep, le64(slot), sep, hexToBytes(stateCommitment))
  );
}

export interface VerifyResult {
  ok: boolean;
  /** Present when ok=false: which check failed. */
  reason?: "signature" | "freshness";
}

/**
 * Verify a proof-of-serve receipt.
 *
 * Checks (1) the node's ed25519 signature over the canonical digest and, when
 * `headSlot` is supplied, (2) that the answer is within `freshnessTolerance` slots
 * of the current head.
 *
 * Note: this verifies attribution and freshness. Confirming that `node` is a bonded
 * operator in good standing is done against the on-chain operator set — see
 * {@link https://elgonrpc.xyz/docs}. That check is tracked in the roadmap.
 */
export async function verifyReceipt(
  read: Answer,
  opts: { headSlot?: number; freshnessTolerance?: number } = {}
): Promise<VerifyResult> {
  const { answer, slot, receipt } = read;
  const digest = receiptDigest(String(answer), slot, receipt.stateCommitment);
  const pubkey = bs58.decode(receipt.node);
  const sig = hexToBytes(receipt.sig);

  const sigOk = await ed25519Verify(sig, digest, pubkey);
  if (!sigOk) return { ok: false, reason: "signature" };

  if (opts.headSlot != null) {
    const tolerance = opts.freshnessTolerance ?? 150;
    if (opts.headSlot - slot > tolerance) return { ok: false, reason: "freshness" };
  }

  return { ok: true };
}

export type { Receipt };

// update env example file

// add env variable reference table
