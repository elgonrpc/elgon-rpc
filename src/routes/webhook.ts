import { Router, Request, Response } from "express";
import crypto from "crypto";
import { supabase } from "../lib/db";
import { logger } from "../lib/logger";

export const webhookRouter = Router();

function verifySignature(payload: Buffer, sigHeader: string, secret: string): boolean {
  const parts = sigHeader.split(",").reduce((acc, part) => {
    const [k, v] = part.split("=");
    acc[k] = v;
    return acc;
  }, {} as Record<string, string>);

  const ts = parts["t"];
  const sig = parts["v1"];
  if (!ts || !sig) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${ts}.${payload.toString()}`)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

webhookRouter.post("/", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

  if (!sig || !secret) {
    return res.status(400).json({ error: "Missing signature" });
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const body = Buffer.concat(chunks);

  if (!verifySignature(body, sig, secret)) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    const event = JSON.parse(body.toString());

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await supabase.from("stripe_payments").upsert({
        session_id: session.id,
        email: session.customer_email || session.customer_details?.email,
        amount: session.amount_total,
        currency: session.currency,
        status: session.payment_status,
      });
    }

    res.json({ received: true });
  } catch (err) {
    logger.error("Webhook processing error", { error: String(err) });
    res.status(500).json({ error: "Webhook failed" });
  }
});
