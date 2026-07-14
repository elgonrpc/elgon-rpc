# Error handling

The SDK exports typed errors that map to distinct failure modes.

| Error | Code | Retryable | When |
|-------|------|-----------|------|
| `NetworkError` | `NETWORK_ERROR` | 429, 5xx, DNS | Transport failure |
| `TimeoutError` | `TIMEOUT` | yes | Request exceeded 30 s |
| `ReceiptVerificationError` | `RECEIPT_INVALID` | no | Signature mismatch |
| `ElgonError` | varies | no | Base class for all SDK errors |

## Built-in retry

The client retries retryable errors up to 3 times with jittered exponential
backoff (200 ms base, 5 s cap). Override via `ClientOptions.retry`:

```ts
const client = new ElgonClient({
  endpoint: "https://rpc.elgonrpc.xyz",
  retry: { maxAttempts: 5, baseDelayMs: 500 },
});
```

Set `maxAttempts: 1` to disable retry entirely.

// verify strike generation bounds
