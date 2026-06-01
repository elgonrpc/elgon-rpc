# Changelog

## [0.2.0-rc] — 2026-06-05

### Added
- Retry logic with jittered exponential backoff (`withRetry`)
- Custom error types: `NetworkError`, `TimeoutError`, `ReceiptVerificationError`
- Configuration reference documentation
- ESLint setup with TypeScript rules
- Unit tests for receipt verification, client, and retry logic
- Batch read and retry examples
- `.npmignore` for clean publishes
- Node registry stub (`src/constants.ts`)
- `RetryConfig` and `timeoutMs` in `ClientOptions`

### Changed
- Client now uses `withRetry` internally for all reads
- `types.ts` expanded with `RetryConfig`, `ClientOptions.retry`, `VerifyResult`
- CI workflow includes lint step

## [0.1.0] — 2026-05-18

### Added
- `ElgonClient` with `getBalance`, `getAccountInfo`, `getTokenAccountBalance`, `getSlot`
- Proof-of-serve receipt verification via `verify()`
- Documentation: quickstart, endpoints, receipts, architecture, errors
