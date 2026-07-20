import { Router, Request, Response } from "express";
import crypto from "crypto";
import { upsert } from "../lib/db";
import { logger } from "../lib/logger";

export const webhookRouter = Router();

const SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

function verify(payload: Buffer, header: string): boolean {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const { t, v1 } = parts;
  if (!t || !v1) return false;

  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(`${t}.${payload.toString()}`)
    .digest("hex");

  const a = Buffer.from(v1);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Raw body — JSON parsing would break the signature.
webhookRouter.post("/", async (req: Request, res: Response) => {
  const header = String(req.headers["stripe-signature"] || "");
  if (!header || !SECRET) return res.status(400).json({ error: "Missing signature" });

  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const body = Buffer.concat(chunks);

  if (!verify(body, header)) return res.status(400).json({ error: "Invalid signature" });

  try {
    const event = JSON.parse(body.toString());
    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      // Keyed on session id so a replayed event updates rather than duplicates.
      await upsert("stripe_payments", {
        session_id: s.id,
        email: s.customer_email || s.customer_details?.email || null,
        amount: s.amount_total,
        currency: s.currency,
        status: s.payment_status,
      });
    }
    res.json({ received: true });
  } catch (err) {
    logger.error("webhook failed", { error: String(err) });
    res.status(500).json({ error: "Webhook processing failed" });
  }
});
