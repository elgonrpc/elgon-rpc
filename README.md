# Elgon RPC SDK

[![CI](https://github.com/elgonrpc/elgon-rpc/actions/workflows/ci.yml/badge.svg)](https://github.com/elgonrpc/elgon-rpc/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/elgon-rpc-sdk)](https://www.npmjs.com/package/elgon-rpc-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

The read layer for Solana — verifiable, geo-distributed read-RPC with signed proof-of-serve receipts.

> **Status:** pre-launch. The public endpoint `rpc.elgonrpc.xyz` is rolling out.
> The SDK and receipt format are stable enough to build against.

## Install

```bash
npm install elgon-rpc-sdk
```

## Quick start

```ts
import { ElgonClient } from "elgon-rpc-sdk";

const elgon = new ElgonClient({
  endpoint: "https://rpc.elgonrpc.xyz",
  accessToken: process.env.ELGON_TOKEN,
});

const read = await elgon.getBalance("So11111111111111111111111111111111111111112");
console.log(read.answer, "lamports @ slot", read.slot);

const { ok, reason } = await elgon.verify(read);
if (!ok) throw new Error(`receipt rejected: ${reason}`);
```

## Verify, don't trust

Every read returns a **proof-of-serve receipt** — an ed25519 signature binding the
answer, slot height, and state commitment to the serving node. The SDK verifies
locally; no second RPC call needed.

## Documentation

- [Quickstart](./docs/quickstart.md)
- [Read methods](./docs/endpoints.md)
- [Receipt format & verification](./docs/receipts.md)
- [Architecture](./docs/architecture.md)
- [Error handling](./docs/errors.md)
- [Configuration](./docs/configuration.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
