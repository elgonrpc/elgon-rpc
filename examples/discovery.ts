/**
 * Discover available nodes and find the closest one.
 *
 *   npx tsx examples/discovery.ts
 */
import { discoverNodes, closestNode } from "../src/discovery";

const ENDPOINT = process.env.ELGON_ENDPOINT ?? "https://rpc.elgonrpc.xyz";

async function main() {
  console.log("Discovering nodes...");
  const nodes = await discoverNodes(ENDPOINT);
  console.log(`Found ${nodes.length} nodes:`);
  for (const n of nodes) {
    console.log(`  ${n.id} (${n.region}) — ${n.pubkey.slice(0, 12)}...`);
  }

  console.log("\nFinding closest node...");
  const closest = await closestNode(ENDPOINT);
  if (closest) {
    console.log(`Closest: ${closest.id} (${closest.region}) — ${closest.latencyMs?.toFixed(0)}ms`);
  } else {
    console.log("No nodes available");
  }
}

main().catch(console.error);
