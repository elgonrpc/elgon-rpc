import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: "ok",
    version: process.env.npm_package_version || "0.5.0",
    uptime: Math.floor(process.uptime()),
    memoryMb: Math.round(mem.rss / 1024 / 1024),
  });
});
