# Proof-of-serve receipts

Every Elgon read carries a receipt so the caller can verify the answer instead of trusting the provider.

## What a receipt contains

| Field | Type | Meaning |
|-------|------|---------|
| `node` | base58 | Bonded operator public key that served and signed the read |
| `stateCommitment` | hex | Hash of the state root the answer is bound to |
| `sig` | hex | ed25519 signature over the canonical digest |

The read itself also carries `answer` and `slot`.

## Canonical digest

The signature is over a SHA-256 digest of the read's fields in a fixed layout:

```
digest = sha256(
  utf8(answer)                ‖
  0x00                        ‖   // domain separator
  le64(slot)                  ‖   // little-endian u64
  0x00                        ‖
  hex→bytes(stateCommitment)
)
```

Reference implementation: [`receiptDigest()`](../src/receipt.ts).

## Verifying

```ts
import { verifyReceipt } from "elgon-rpc-sdk";

const result = await verifyReceipt(read, { headSlot, freshnessTolerance: 150 });
// result.ok === true  → signature valid and (if headSlot given) fresh
// result.reason        → "signature" | "freshness" when ok === false
```

Steps performed:

1. Recompute the canonical digest from `answer`, `slot`, `stateCommitment`.
2. Verify the node's ed25519 signature over the digest.
3. If `headSlot` is provided, reject when `headSlot - slot` exceeds the freshness tolerance.

## What is not yet enforced client-side

Confirming that `node` is a **bonded operator in good standing** requires the on-chain operator set. The SDK verifies attribution and freshness today; the operator-set check is on the [roadmap](../README.md#roadmap). Until then, treat `node` as attributable but not yet economically bonded in the local verifier.
