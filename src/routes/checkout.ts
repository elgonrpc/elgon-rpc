import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { logger } from "../lib/logger";

export const checkoutRouter = Router();

const SECRET = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(SECRET, { apiVersion: "2024-12-18.acacia" });

const PLANS: Record<string, { name: string; amount: number; currency: string; interval: "month" }> = {
  growth: { name: "Growth", amount: 4900, currency: "usd", interval: "month" },
};

checkoutRouter.post("/session", async (req: Request, res: Response) => {
  const { plan, base } = req.body as { plan?: string; base?: string };
  const info = PLANS[String(plan)];

  if (!info) return res.status(400).json({ error: `Unknown plan: ${plan}` });

  // Without a key configured the client renders a labelled demo flow instead of
  // sending anyone to a checkout that cannot complete.
  if (!SECRET) return res.json({ ...info, plan, demo: true });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: info.currency,
          product_data: { name: `Elgon ${info.name}` },
          unit_amount: info.amount,
          recurring: { interval: info.interval },
        },
        quantity: 1,
      }],
      success_url: `${base}/dashboard?upgraded=1`,
      cancel_url: `${base}/pricing`,
    });
    res.json({ url: session.url });
  } catch (err) {
    logger.error("stripe session failed", { error: String(err) });
    res.status(500).json({ error: "Checkout unavailable" });
  }
});
