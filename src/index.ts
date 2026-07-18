import express from "express";
import cors from "cors";

import { quotesRouter } from "./routes/quotes";
import { searchRouter } from "./routes/search";
import { optionsRouter } from "./routes/options";
import { predictionsRouter } from "./routes/predictions";
import { moversRouter } from "./routes/movers";
import { keysRouter } from "./routes/keys";
import { checkoutRouter } from "./routes/checkout";
import { webhookRouter } from "./routes/webhook";
import { connectRouter } from "./routes/connect";
import { healthRouter } from "./routes/health";

import { errorHandler } from "./middleware/errors";
import { rateLimiter } from "./middleware/rateLimit";
import { logger } from "./lib/logger";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(express.json());

// Public — no key required.
app.use("/api/health", healthRouter);

// Stripe needs the raw body for signature verification, so it is mounted
// before the JSON-parsed, rate-limited API surface.
app.use("/api/checkout/webhook", webhookRouter);

app.use(rateLimiter);

app.use("/api/v1/quotes", quotesRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/options", optionsRouter);
app.use("/api/v1/predictions", predictionsRouter);
app.use("/api/v1/movers", moversRouter);
app.use("/api/keys", keysRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/connect", connectRouter);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => logger.info(`Elgon API listening on :${PORT}`));
}

export { app };
