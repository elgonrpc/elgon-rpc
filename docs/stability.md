# API Stability

## Stable

The following APIs are stable and follow semver:

- `ElgonClient` constructor and all read methods
- `verify()` return type and behavior
- `Answer`, `Receipt`, `ClientOptions` types
- Error types: `ElgonError`, `NetworkError`, `TimeoutError`, `ReceiptVerificationError`
- Receipt canonical digest format (see [receipts.md](./receipts.md))

## Unstable

The following may change in minor releases:

- `discoverNodes()` / `closestNode()` — endpoint not finalized
- `batchRead()` — may switch to native batch endpoint
- `checkHealth()` — response shape may expand
- Utility helpers (`lamportsToSol`, etc.) — may move to a separate package

## Deprecated

Nothing yet.
