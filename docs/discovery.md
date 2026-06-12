# Node discovery

Elgon runs a geo-distributed set of read nodes. The SDK can discover available
nodes and measure latency to find the closest one.

## List nodes

```ts
import { discoverNodes } from "elgon-rpc-sdk/discovery";

const nodes = await discoverNodes("https://rpc.elgonrpc.xyz");
// [{ id: "us-east-1", region: "us-east", pubkey: "elgon1q..." }, ...]
```

## Find closest node

```ts
import { closestNode } from "elgon-rpc-sdk/discovery";

const best = await closestNode("https://rpc.elgonrpc.xyz");
console.log(best.id, best.latencyMs);
```

The closest-node check sends a HEAD request to each node and ranks by round-trip
time. Results are not cached — call once at startup and reuse.

## Node identity

Each node holds an ed25519 keypair. The `pubkey` in the discovery response matches
the `receipt.node` field in read answers. Verifying a receipt against a discovered
node confirms both attribution and network path.
