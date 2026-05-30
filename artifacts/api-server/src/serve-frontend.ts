import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Setup frontend static file serving and SPA routing
 * This allows the Vite-built frontend to be served from the API server
 */
export function setupFrontendServing(app: express.Express) {
  const frontendPath = path.resolve(__dirname, "../../artifacts/netco/dist");

  // Serve static files with proper caching
  app.use(
    express.static(frontendPath, {
      maxAge: "1h", // Cache assets for 1 hour
      etag: true,
    })
  );

  // SPA routing: serve index.html for any non-API routes
  app.get(/^(?!\/api\/).*$/, (req: Request, res: Response) => {
    // Only serve index.html for HTML requests (not API calls, not static files with extensions)
    const acceptHeader = req.accepts(["html", "json"]);
    
    if (acceptHeader === "html" || !req.path.includes(".")) {
      res.sendFile(path.join(frontendPath, "index.html"), (err) => {
        if (err && (err as NodeJS.ErrnoException).code !== "ENOENT") {
          res.status(500).send("Error loading application");
        }
      });
    } else {
      res.status(404).send("Not Found");
    }
  });
}
