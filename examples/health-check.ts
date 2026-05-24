/**
 * Check endpoint health and print status.
 *
 *   npx tsx examples/health-check.ts
 */
import { checkHealth } from "../src/health";

const ENDPOINT = process.env.ELGON_ENDPOINT ?? "https://rpc.elgonrpc.xyz";

async function main() {
  console.log(`Checking ${ENDPOINT}...`);
  const status = await checkHealth(ENDPOINT);

  if (status.ok) {
    console.log(`  Status: OK`);
    console.log(`  Latency: ${status.latencyMs.toFixed(0)}ms`);
    console.log(`  Slot: ${status.slot}`);
    console.log(`  Version: ${status.version}`);
  } else {
    console.log(`  Status: DOWN`);
    console.log(`  Latency: ${status.latencyMs.toFixed(0)}ms`);
    process.exit(1);
  }
}

main();
