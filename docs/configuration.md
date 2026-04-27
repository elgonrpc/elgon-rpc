# Configuration

## ClientOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `endpoint` | `string` | — | Elgon RPC endpoint URL (required) |
| `accessToken` | `string` | — | Bearer token for authenticated tier |
| `retry.maxAttempts` | `number` | `3` | Max retry attempts for retryable errors |
| `retry.baseDelayMs` | `number` | `200` | Base delay for exponential backoff |
| `retry.maxDelayMs` | `number` | `5000` | Maximum delay cap |
| `timeoutMs` | `number` | `30000` | Per-request timeout in milliseconds |

## Environment variables

| Variable | Description |
|----------|-------------|
| `ELGON_ENDPOINT` | Default endpoint (overridden by constructor) |
| `ELGON_TOKEN` | Default access token |

## Rate limits

| Tier | Reads/min | Burst |
|------|-----------|-------|
| Free | 60 | 10 |
| Authenticated | 600 | 50 |
| Enterprise | custom | custom |

Hitting the limit returns HTTP 429. The SDK retries automatically with backoff.
