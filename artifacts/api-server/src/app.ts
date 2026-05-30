import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import multer from "multer";
import router from "./routes";
import { logger } from "./lib/logger";
import { setupFrontendServing } from "./serve-frontend";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Custom middleware to handle JSON parsing while allowing multipart uploads
// This prevents express.json() from trying to parse file upload streams
app.use((req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers["content-type"] || "";
  // Skip JSON parsing for multipart form data (file uploads)
  // Let multer and its handlers process these instead
  if (contentType.includes("multipart/form-data")) {
    return next();
  }
  // For all other requests, parse as JSON
  express.json()(req, res, next);
});

// Mount API routes
app.use("/api", router);

// Serve frontend (must be after API routes so /api/* is handled first)
setupFrontendServing(app);

// Error handler (must be last)
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof Error) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err.message ?? "Internal server error";
    logger.error({ err, url: req.url, method: req.method }, "Unhandled error");
    res.status(status).json({ error: message });
    return;
  }
  logger.error({ err }, "Unknown error");
  res.status(500).json({ error: "Internal server error" });
});

export default app;
