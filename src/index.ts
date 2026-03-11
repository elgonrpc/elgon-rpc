import express from "express";
import cors from "cors";
import { quotesRouter } from "./routes/quotes";
import { searchRouter } from "./routes/search";
import { healthRouter } from "./routes/health";
import { errorHandler } from "./middleware/errors";
import { rateLimiter } from "./middleware/rateLimit";
import { logger } from "./lib/logger";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use("/api/v1/quotes", quotesRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/health", healthRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Elgon API listening on :${PORT}`);
});

export { app };
