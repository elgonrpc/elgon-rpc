import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { logger } from "../lib/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

const PLANS: Record<string, { name: string; amount: number; currency: string; interval: string }> = {
  growth: { name: "Growth", amount: 4900, currency: "usd", interval: "month" },
};

export const checkoutRouter = Router();

checkoutRouter.post("/session", async (req: Request, res: Response) => {
  const { plan, base } = req.body;
  const planInfo = PLANS[plan];

  if (!planInfo) {
    return res.status(400).json({ error: `Unknown plan: ${plan}` });
  }

  if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_live")) {
    return res.json({ ...planInfo, plan, demo: true });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: planInfo.currency,
          product_data: { name: `Elgon ${planInfo.name}` },
          unit_amount: planInfo.amount,
          recurring: { interval: planInfo.interval as "month" },
        },
        quantity: 1,
      }],
      success_url: `${base}/dashboard?upgraded=1`,
      cancel_url: `${base}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    logger.error("Stripe session error", { error: String(err) });
    res.status(500).json({ error: "Checkout failed" });
  }
});

// return 404 for unknown symbols instead of empty array

// compose middleware chain
