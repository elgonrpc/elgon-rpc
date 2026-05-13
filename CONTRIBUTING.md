# Contributing to Elgon RPC

Elgon is early and moving fast. Issues, ideas, and PRs are welcome.

## Ground rules

- **Honesty first.** No fabricated benchmarks, no invented adoption numbers, no fake receipts in docs or tests. If something is a stub or WIP, label it as such.
- Keep the SDK surface small and typed. New public API needs a doc note and an example.
- Cryptographic code (`src/receipt.ts`) changes must keep the canonical digest layout in `docs/receipts.md` in sync.

## Dev setup

```bash
npm install
npm run typecheck
npm test
```

## Pull requests

1. Fork and branch from `main`.
2. Keep changes focused; describe the *why* in the PR body.
3. Make sure `npm run typecheck` and `npm test` pass.

## Reporting issues

Include the SDK version, the endpoint you hit, and — if it's a verification bug — the `answer`, `slot`, and `receipt` so it can be reproduced.
