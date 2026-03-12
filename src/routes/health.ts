import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    status: "ok",
    version: process.env.npm_package_version || "0.1.0",
    uptime: Math.floor(process.uptime()),
  });
});

healthRouter.get("/ready", (_req, res) => {
  res.json({ ready: true });
});
