# Quickstart

> Elgon is pre-launch. The public endpoint `rpc.elgonrpc.xyz` is rolling out — the SDK and receipt format below are stable enough to build against.

## Install

```bash
npm install elgon-rpc-sdk
```

## Make a verifiable read

```ts
import { ElgonClient } from "elgon-rpc-sdk";

const elgon = new ElgonClient({
  endpoint: "https://rpc.elgonrpc.xyz",
  accessToken: process.env.ELGON_TOKEN, // optional — raises your rate-limit tier
});

const read = await elgon.getBalance("So11111111111111111111111111111111111111112");
console.log(read.answer, "lamports @ slot", read.slot);

const { ok, reason } = await elgon.verify(read);
if (!ok) throw new Error(`receipt rejected: ${reason}`);
```

## Enforce freshness

Pass a head slot from a source you trust to reject stale answers:

```ts
const { ok } = await elgon.verify(read, headSlot);
```

## Raw reads

Anything the endpoint exposes is reachable via `read()`:

```ts
const info = await elgon.read({ method: "getAccountInfo", params: [address] });
```

See [endpoints.md](./endpoints.md) for the method list and [receipts.md](./receipts.md) for how verification works.
