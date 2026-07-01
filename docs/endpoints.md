# Read methods

All reads are `POST {endpoint}/read` with a JSON body `{ "method", "params" }` and return an
`Answer` — `{ answer, slot, receipt }`. Every method's answer is covered by a proof-of-serve receipt.

| Method | Params | Answer |
|--------|--------|--------|
| `getBalance` | `[address]` | lamport balance (string) |
| `getAccountInfo` | `[address]` | base64 account data (string) |
| `getTokenAccountBalance` | `[tokenAccount]` | raw token amount (string) |
| `getSlot` | `[]` | current head slot (string) |

> The method surface tracks common Solana read paths and grows with the endpoint rollout.
> Anything listed here is reachable through the typed SDK helpers or the low-level
> [`read()`](../src/index.ts) call. Methods not yet served return a `501` with a
> `not_implemented` body rather than a fabricated answer.

## Example

```bash
curl https://rpc.elgonrpc.xyz/read \
  -H "content-type: application/json" \
  -d '{"method":"getBalance","params":["So11111111111111111111111111111111111111112"]}'
```

```jsonc
{
  "answer": "1000000000",
  "slot": 301923844,
  "receipt": { "node": "elgon1q...", "stateCommitment": "0x...", "sig": "0x..." }
}
```

// add symbol validation regex
