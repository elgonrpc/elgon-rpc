import { Router, Request, Response } from "express";
import { searchSymbols } from "../providers/yahoo";
import { validateApiKey } from "../middleware/auth";
import { makeReceipt } from "../lib/receipt";

export const searchRouter = Router();

searchRouter.get("/", validateApiKey, async (req: Request, res: Response) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "Missing ?q parameter" });

  const data = await searchSymbols(q);
  res.json({
    data,
    source: "live",
    plan: res.locals.plan,
    receipt: makeReceipt(data, "/api/v1/search"),
  });
});
