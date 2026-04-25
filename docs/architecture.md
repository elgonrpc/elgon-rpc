# Architecture

Elgon sits between the application and full Solana RPC nodes. Every read is served
from the closest geo-distributed edge node, and every answer carries a signed
**proof-of-serve receipt** so the caller can verify without trusting the relay.

## Request flow

```
App  ──▶  Elgon edge  ──▶  Upstream validator
              │
              ▼
         sign receipt
              │
              ▼
     { answer, slot, receipt }
```

The receipt binds the answer bytes, slot height, and state commitment to the
serving node's ed25519 key. Clients verify locally — see [receipts.md](./receipts.md).

## Node identity

Each edge node holds an ed25519 keypair whose public key is registered on-chain.
The SDK ships a copy of the node registry for offline verification; live rotation
is handled via the `/nodes` discovery endpoint.

## Freshness

The `slot` field in the answer is the validator-attested head slot at read time.
Callers who track head slot independently can pass it to `verify()` to reject
stale answers — useful for DeFi reads where a 2-slot delay matters.
