<div align="center">

# Elgon

**Market data API for Robinhood — stock & crypto quotes, options, instrument search.**

<!-- ━━━ CONTRACT ADDRESS (uncomment and fill when ready) ━━━
> **CA:** `YOUR_CONTRACT_ADDRESS_HERE`
>
> [![Chain](https://img.shields.io/badge/chain-ETH-627EEA?style=flat-square&logo=ethereum&logoColor=white)]()
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![CI](https://github.com/elgonrpc/elgon-rpc/actions/workflows/ci.yml/badge.svg)](https://github.com/elgonrpc/elgon-rpc/actions)
[![Version](https://img.shields.io/badge/version-0.5.0-green.svg)](./CHANGELOG.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/Node.js-%E2%89%A522-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)

[Website](https://elgonrpc.xyz) · [API Docs](https://elgonrpc.xyz/docs) · [Dashboard](https://elgonrpc.xyz/dashboard)

</div>

---

## What is Elgon?

Elgon is an HTTP API that returns market data — stock and crypto quotes, instrument search, simulated options chains, and prediction-market figures — plus an optional read-only view of a connected Robinhood account.

Built for developers who want a clean, key-authenticated REST API without vendor lock-in.

## Quick start

```bash
# Get a free API key (no signup required)
curl -X POST https://elgonrpc.xyz/api/keys

# Fetch a quote
curl "https://elgonrpc.xyz/api/v1/quotes?symbols=AAPL&key=YOUR_KEY"
```

Or use the shared sandbox key: `elgon_sandbox_pub`

## Features

| Feature | Endpoint | Status |
|---------|----------|--------|
| Stock & crypto quotes | `GET /api/v1/quotes` | Live (delayed) |
| Instrument search | `GET /api/v1/search` | Live |
| Options chain | `GET /api/v1/options/:symbol` | Simulated |
| Prediction markets | `GET /api/v1/predictions` | Simulated |
| Top movers | `GET /api/v1/movers` | Live |
| API key minting | `POST /api/keys` | Live |
| Stripe checkout | `POST /api/checkout/session` | Live |
| Robinhood connect | `POST /api/connect/session` | Live (via SnapTrade) |

## Authentication

Three ways to pass your API key:

```bash
# Query parameter
curl "https://elgonrpc.xyz/api/v1/quotes?symbols=AAPL&key=YOUR_KEY"

# Header
curl -H "X-Api-Key: YOUR_KEY" "https://elgonrpc.xyz/api/v1/quotes?symbols=AAPL"

# Bearer token
curl -H "Authorization: Bearer YOUR_KEY" "https://elgonrpc.xyz/api/v1/quotes?symbols=AAPL"
```

## Rate limits

| Plan | Requests/min | Price |
|------|-------------|-------|
| Free | 60 | $0 |
| Growth | 600 | $49/mo |
| Sandbox (shared) | 20 | $0 |

## Example response

```json
{
  "data": [{
    "symbol": "AAPL",
    "price": 234.56,
    "change": 2.31,
    "changePct": 0.99,
    "volume": 52340000,
    "marketCap": 3600000000000,
    "name": "Apple Inc.",
    "assetClass": "stock",
    "timestamp": 1721400000000
  }],
  "meta": {
    "count": 1,
    "delayed": true
  }
}
```

## Self-host

```bash
git clone https://github.com/elgonrpc/elgon-rpc.git
cd elgon-rpc
npm install
cp .env.example .env  # fill in your keys
npm run dev
```

### Docker

```bash
docker-compose up -d
```

## Important disclaimers

- Quotes are **delayed**, not real-time. Do not trade based on this data.
- Options chains and prediction markets are **simulated** (sandbox).
- Brokerage connections are **read-only** — Elgon cannot place trades.
- Elgon is an **independent project**, not affiliated with Robinhood.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
