/**
 * Demonstrates custom retry configuration.
 *
 *   npx tsx examples/with-retry.ts
 */
import { ElgonClient, NetworkError, TimeoutError } from "../src/index";

async function main() {
  const client = new ElgonClient({
    endpoint: process.env.ELGON_ENDPOINT ?? "https://rpc.elgonrpc.xyz",
    accessToken: process.env.ELGON_TOKEN,
    retry: {
      maxAttempts: 5,
      baseDelayMs: 500,
      maxDelayMs: 10_000,
    },
  });

  try {
    const slot = await client.getSlot();
    console.log(`current slot: ${slot.answer}`);
    console.log(`node: ${slot.receipt.node}`);
  } catch (err) {
    if (err instanceof TimeoutError) {
      console.error("all retries timed out");
    } else if (err instanceof NetworkError) {
      console.error(`network error after retries: ${err.message} (${err.statusCode})`);
    } else {
      throw err;
    }
  }
}

main();

// handle fetch timeout gracefully
