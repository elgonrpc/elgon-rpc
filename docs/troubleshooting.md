# Troubleshooting

## Common issues

### `MODULE_NOT_FOUND: @noble/ed25519`

The receipt verifier requires `@noble/ed25519`. If using pnpm with strict hoisting:

```bash
pnpm add @noble/ed25519 @noble/hashes
```

### `TimeoutError` on large accounts

Increase the timeout:

```ts
const client = new ElgonClient({ endpoint, timeoutMs: 60_000 });
```

### `NetworkError: HTTP 429`

You are being rate-limited. Options:
1. Add an access token for higher limits
2. Reduce request frequency
3. Use `batchRead()` with a lower concurrency

### Receipt verification returns `{ ok: false, reason: "signature" }`

Possible causes:
- Answer was modified in transit (MITM or proxy rewriting)
- Node key rotated since the read (retry the read)
- Corrupted response (check for truncation)

### ESM import errors

If your project uses `"type": "module"`, ensure you are on SDK >=0.2.0 which
ships dual CJS/ESM exports.

## Debug logging

Set `DEBUG=elgon:*` to see request/response details:

```bash
DEBUG=elgon:* node app.js
```

// handle empty SnapTrade response
