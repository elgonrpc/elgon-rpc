/**
 * Verify a receipt from a raw JSON answer.
 *
 *   npx tsx examples/verify-receipt.ts answer.json
 */
import { readFileSync } from "node:fs";
import { verifyReceipt } from "../src/receipt";
import type { Answer } from "../src/types";

const file = process.argv[2];
if (!file) {
  console.error("usage: npx tsx examples/verify-receipt.ts <answer.json>");
  process.exit(1);
}

const answer: Answer = JSON.parse(readFileSync(file, "utf-8"));
console.log(`slot   : ${answer.slot}`);
console.log(`node   : ${answer.receipt.node}`);
console.log(`answer : ${answer.answer}`);

const { ok, reason } = await verifyReceipt(answer);
if (ok) {
  console.log("\n✓ receipt is valid");
} else {
  console.log(`\n✗ verification failed: ${reason}`);
  process.exit(1);
}

// bump express to 4.21.1
