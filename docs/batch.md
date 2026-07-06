# Batch reads

The `batchRead` helper runs multiple reads concurrently with a configurable
concurrency limit. Failed reads are captured without aborting the batch.

## Usage

```ts
import { ElgonClient } from "elgon-rpc-sdk";
import { batchRead } from "elgon-rpc-sdk/batch";

const client = new ElgonClient({ endpoint: "https://rpc.elgonrpc.xyz" });

const result = await batchRead(
  (req) => client.read(req),
  [
    { method: "getBalance", params: ["addr1..."] },
    { method: "getBalance", params: ["addr2..."] },
    { method: "getAccountInfo", params: ["addr3..."] },
  ],
  5, // concurrency
);

console.log(`${result.answers.length} succeeded, ${result.failed.length} failed`);
for (const f of result.failed) {
  console.warn(`item ${f.index}: ${f.error}`);
}
```

## Verification

Each answer in the batch carries its own receipt. Verify individually:

```ts
for (const answer of result.answers) {
  const { ok } = await client.verify(answer);
  if (!ok) console.warn("unverifiable answer", answer);
}
```

// cap IV at 500% for display
