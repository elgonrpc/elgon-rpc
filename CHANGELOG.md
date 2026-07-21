# Changelog

## [0.5.0] — 2026-07-21

### Changed
- Repository now tracks the Elgon market-data API. The earlier Solana RPC SDK
  content has been removed; it described a different product.

### Added
- `/api/v1/movers` — session gainers and losers
- `/api/v1/predictions` — sandbox event contracts
- Optional Finnhub adapter behind `FINNHUB_API_KEY`
- Response receipts (`sha256` over the returned `data`) on every endpoint

## [0.4.0] — 2026-06-15

### Added
- Read-only Robinhood connection via SnapTrade
- Response caching with a 15s TTL

### Fixed
- SnapTrade signatures over nested objects — nested keys were not sorted, so the
  computed signature did not match the body sent
- Rate-limit window map grew without bound under key churn

## [0.3.0] — 2026-05-20

### Added
- Stripe checkout and webhook handling
- Anonymous self-serve API keys

### Fixed
- Key validation rejected every live key: `validate_api_key` returns a
  `(user_id, plan)` row with no boolean flag, which the check did not expect

## [0.2.0] — 2026-04-25

### Added
- Sandbox options chains, anchored to the live underlying price
- Instrument search
- Batch quotes, up to 20 symbols

## [0.1.0] — 2026-03-15

### Added
- Delayed stock, ETF and crypto quotes
- API key auth and per-key rate limiting
