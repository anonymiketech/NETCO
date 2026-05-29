import express, { Express, Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./artifacts/api-server/src/routes/index.js";
import { logger } from "./artifacts/api-server/src/lib/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// API routes - prefix with /api
app.use("/api", apiRouter);

// Serve static files from the Vite build output
const distPath = path.join(__dirname, "artifacts/netco/dist");
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes that don't match static files
app.get("*", (req: Request, res: Response) => {
  // Don't fall back for API routes or already handled static files
  if (req.path.startsWith("/api")) {
    res.status(404).json({ error: "Not Found" });
    return;
  }
  
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handler
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error("[v0] Error:", err);
  const status = (err as any)?.status ?? 500;
  const message = (err as any)?.message ?? "Internal server error";
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`[v0] Server listening on port ${PORT}`);
  console.log(`[v0] Frontend: http://localhost:${PORT}`);
  console.log(`[v0] API routes available at: http://localhost:${PORT}/api`);
});
