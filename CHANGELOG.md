# Changelog

## [0.2.0] — 2026-06-27

### Added
- Node discovery: `discoverNodes()` and `closestNode()` helpers
- Batch read: `batchRead()` with configurable concurrency
- Utility helpers: `lamportsToSol`, `solToLamports`, `abbreviateAddress`, `chunks`
- GitHub issue templates (bug report, feature request)
- Documentation: discovery, batch reads

### Changed
- Bumped version to 0.2.0

## [0.1.0] — 2026-05-18

### Added
- `ElgonClient` with `getBalance`, `getAccountInfo`, `getTokenAccountBalance`, `getSlot`
- Proof-of-serve receipt verification via `verify()`
- Built-in retry with jittered exponential backoff
- Typed errors: `NetworkError`, `TimeoutError`, `ReceiptVerificationError`
- Freshness check via optional `headSlot` parameter
- Documentation: quickstart, endpoints, receipts, architecture, errors, configuration
- ESLint setup, CI workflow with lint step
