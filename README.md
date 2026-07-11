<p align="center">
  <a href="https://elgonrpc.xyz"><img src="./assets/banner.jpg" alt="Elgon RPC" /></a>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://solana.com"><img src="https://img.shields.io/badge/Solana-mainnet-9945FF?logo=solana&logoColor=white" alt="Solana" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-%E2%89%A520-339933?logo=nodedotjs&logoColor=white" alt="Node.js ≥20" /></a>
  <a href="https://elgonrpc.xyz"><img src="https://img.shields.io/badge/docs-elgonrpc.xyz-8B5CF6" alt="Docs" /></a>
  <a href="https://github.com/elgonrpc/elgon-rpc/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" /></a>
  <a href="https://github.com/elgonrpc/elgon-rpc/stargazers"><img src="https://img.shields.io/github/stars/elgonrpc/elgon-rpc?style=flat&color=yellow" alt="Stars" /></a>
  <a href="https://github.com/elgonrpc/elgon-rpc/commits/main"><img src="https://img.shields.io/github/last-commit/elgonrpc/elgon-rpc?color=blue" alt="Last commit" /></a>
</p>

---

> **Status:** pre-launch. The public endpoint `rpc.elgonrpc.xyz` is rolling out.
> The SDK and receipt format are stable enough to build against.

## Why Elgon?

Standard Solana RPC gives you an answer and asks you to trust it. Elgon gives you an answer **and a receipt** — a cryptographic proof that a bonded node actually served that data at a specific slot. Verify locally, no second call needed.

| | Traditional RPC | Elgon |
|---|---|---|
| **Trust model** | Trust the provider | Verify the receipt |
| **Proof** | None | ed25519 signature over `(answer, slot, stateCommitment)` |
| **Freshness** | Hope it's current | Enforce via `headSlot` check |
| **Attribution** | IP-based | Cryptographic node identity |
| **Geo-routing** | Single region | Closest edge node via discovery |

## Install

```bash
npm install elgon-rpc-sdk
```

## Quick start

```ts
import { ElgonClient } from "elgon-rpc-sdk";

const elgon = new ElgonClient({
  endpoint: "https://rpc.elgonrpc.xyz",
  accessToken: process.env.ELGON_TOKEN, // optional — raises rate-limit tier
});

// Read a balance — the answer comes with a proof-of-serve receipt
const read = await elgon.getBalance("So11111111111111111111111111111111111111112");
console.log(read.answer, "lamports @ slot", read.slot);

// Verify the receipt locally — no second RPC call
const { ok, reason } = await elgon.verify(read);
if (!ok) throw new Error(`receipt rejected: ${reason}`);
```

## Core concepts

### Verify, don't trust

Every read returns a **proof-of-serve receipt** — an ed25519 signature binding the answer, slot height, and state commitment to the serving node's identity. The SDK verifies locally; no second RPC call, no trust assumption.

```
App  ──▶  Elgon edge node  ──▶  Upstream validator
               │
               ▼
          sign receipt
               │
               ▼
      { answer, slot, receipt }
```

### Freshness enforcement

Pass a head slot from a source you trust to reject stale answers:

```ts
const { ok, reason } = await elgon.verify(read, headSlot);
// rejects if answer.slot is more than 150 slots behind headSlot
```

### Built-in retry

Transient failures (429, 5xx, timeouts) are retried automatically with jittered exponential backoff:

```ts
const client = new ElgonClient({
  endpoint: "https://rpc.elgonrpc.xyz",
  retry: {
    maxAttempts: 5,
    baseDelayMs: 500,
    maxDelayMs: 10_000,
  },
});
```

## API reference

### Read methods

All reads go through `POST /read` and return an `Answer` with a receipt.

| Method | Params | Answer |
|--------|--------|--------|
| `getBalance` | `[address]` | Lamport balance (string) |
| `getAccountInfo` | `[address]` | Base64 account data (string) |
| `getTokenAccountBalance` | `[tokenAccount]` | Raw token amount (string) |
| `getSlot` | `[]` | Current head slot (string) |

```ts
// Typed helpers
const balance = await elgon.getBalance(address);
const info = await elgon.getAccountInfo(address);
const tokenBal = await elgon.getTokenAccountBalance(tokenAccount);
const slot = await elgon.getSlot();

// Raw read — any method the endpoint exposes
const custom = await elgon.read({ method: "getAccountInfo", params: [address] });
```

### Node discovery

Find available edge nodes and measure latency:

```ts
import { discoverNodes, closestNode } from "elgon-rpc-sdk/discovery";

const nodes = await discoverNodes("https://rpc.elgonrpc.xyz");
const best = await closestNode("https://rpc.elgonrpc.xyz");
console.log(`Closest: ${best.id} (${best.region}) — ${best.latencyMs}ms`);
```

### Batch reads

Run multiple reads concurrently with a configurable concurrency limit:

```ts
import { batchRead } from "elgon-rpc-sdk/batch";

const result = await batchRead(
  (req) => client.read(req),
  [
    { method: "getBalance", params: ["addr1..."] },
    { method: "getBalance", params: ["addr2..."] },
  ],
  5, // concurrency
);
console.log(`${result.answers.length} ok, ${result.failed.length} failed`);
```

### Utilities

```ts
import { lamportsToSol, solToLamports, abbreviateAddress } from "elgon-rpc-sdk/utils";

lamportsToSol("1000000000");        // 1
solToLamports(0.5);                 // 500000000n
abbreviateAddress("So111...112");   // "So11...1112"
```

## Error handling

The SDK exports typed errors for each failure mode:

| Error | Code | Retryable | When |
|-------|------|-----------|------|
| `NetworkError` | `NETWORK_ERROR` | 429, 5xx | Transport failure |
| `TimeoutError` | `TIMEOUT` | Yes | Request exceeded 30s |
| `ReceiptVerificationError` | `RECEIPT_INVALID` | No | Signature mismatch |
| `ElgonError` | varies | No | Base class |

```ts
import { NetworkError, TimeoutError } from "elgon-rpc-sdk";

try {
  await client.getBalance(address);
} catch (err) {
  if (err instanceof TimeoutError) {
    console.error("Request timed out after retries");
  } else if (err instanceof NetworkError) {
    console.error(`Network error: ${err.message} (HTTP ${err.statusCode})`);
  }
}
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `endpoint` | `string` | — | Elgon RPC endpoint URL (required) |
| `accessToken` | `string` | — | Bearer token for authenticated tier |
| `retry.maxAttempts` | `number` | `3` | Max retry attempts |
| `retry.baseDelayMs` | `number` | `200` | Base delay for backoff |
| `retry.maxDelayMs` | `number` | `5000` | Maximum delay cap |
| `timeoutMs` | `number` | `30000` | Per-request timeout |

**Environment variables:**

| Variable | Description |
|----------|-------------|
| `ELGON_ENDPOINT` | Default endpoint (overridden by constructor) |
| `ELGON_TOKEN` | Default access token |

**Rate limits:**

| Tier | Reads/min | Burst |
|------|-----------|-------|
| Free | 60 | 10 |
| Authenticated | 600 | 50 |
| Enterprise | Custom | Custom |

## Receipt format

The receipt is an ed25519 signature over a SHA-256 digest:

```
digest = sha256(
  utf8(answer)           ‖
  0x00                   ‖   // domain separator
  le64(slot)             ‖   // little-endian u64
  0x00                   ‖
  hex→bytes(stateCommitment)
)
```

| Field | Type | Description |
|-------|------|-------------|
| `node` | base58 | Bonded operator public key |
| `stateCommitment` | hex | State root hash the answer is bound to |
| `sig` | hex | ed25519 signature over the canonical digest |

Full spec: [docs/receipts.md](./docs/receipts.md)

## Examples

| Example | Description |
|---------|-------------|
| [quickstart.ts](./examples/quickstart.ts) | Read a balance and verify the receipt |
| [verify-receipt.ts](./examples/verify-receipt.ts) | Verify a receipt from a JSON file |
| [batch-read.ts](./examples/batch-read.ts) | Read multiple accounts in parallel |
| [with-retry.ts](./examples/with-retry.ts) | Custom retry configuration |
| [discovery.ts](./examples/discovery.ts) | Discover nodes and find the closest |

```bash
# Run any example
npx tsx examples/quickstart.ts
```

## Documentation

- [Quickstart](./docs/quickstart.md) — Install, first read, verify
- [Read methods](./docs/endpoints.md) — Supported methods and params
- [Receipt format](./docs/receipts.md) — Canonical digest, byte layout, verification
- [Architecture](./docs/architecture.md) — Request flow, node identity, freshness
- [Error handling](./docs/errors.md) — Error types, retry behavior
- [Configuration](./docs/configuration.md) — Client options, env vars, rate limits
- [Node discovery](./docs/discovery.md) — Finding and selecting edge nodes
- [Batch reads](./docs/batch.md) — Concurrent reads with concurrency control

## Roadmap

- [ ] On-chain operator set verification in `verify()`
- [ ] WebSocket subscriptions for streaming reads
- [ ] Multi-region latency benchmarks
- [ ] npm publish (once endpoint is GA)
- [ ] React hooks (`useElgonBalance`, `useElgonRead`)
- [ ] Python SDK

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)

// return exchange info in quote
