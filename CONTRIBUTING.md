# Contributing

Elgon is early and moving fast. Issues, ideas and PRs are welcome.

## Ground rules

- **Honesty first.** No fabricated benchmarks, no invented adoption numbers, no
  screenshots of data the API cannot actually return. If something is sandbox,
  simulated or delayed, the docs and the response must say so.
- Delayed data stays labelled delayed. Sandbox endpoints stay labelled sandbox.
- Brokerage access is read-only. PRs that add order placement will be closed.
- Keep the public surface small and typed. New endpoints need a docs entry and
  an example under `examples/`.

## Getting set up

```bash
npm ci
cp .env.example .env
npm run dev
```

Most endpoints work without credentials. Key minting needs Supabase; checkout
and brokerage connect degrade to a labelled demo mode when unset.

## Before opening a PR

```bash
npm run lint
npm run typecheck
npm test
```

Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`.
