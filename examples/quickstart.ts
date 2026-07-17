/**
 * Minimal end-to-end example: read a balance and verify the receipt locally.
 *
 *   npm install elgon-rpc-sdk
 *   ELGON_TOKEN=... npx tsx examples/quickstart.ts
 */
import { ElgonClient } from "../src/index";

const WSOL = "So11111111111111111111111111111111111111112";

async function main() {
  const elgon = new ElgonClient({
    endpoint: process.env.ELGON_ENDPOINT ?? "https://rpc.elgonrpc.xyz",
    accessToken: process.env.ELGON_TOKEN,
  });

  const read = await elgon.getBalance(WSOL);
  console.log(`answer : ${read.answer} lamports`);
  console.log(`slot   : ${read.slot}`);
  console.log(`node   : ${read.receipt.node}`);

  const { ok, reason } = await elgon.verify(read);
  console.log(ok ? "✓ receipt verified — verify, don't trust" : `✗ receipt rejected: ${reason}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// verify rate limit window
