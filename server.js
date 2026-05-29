const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Import API routes dynamically
const apiRouter = require("./artifacts/api-server/dist/index.mjs");

// API routes - prefix with /api
app.use("/api", apiRouter.default || apiRouter);

// Serve static files from the Vite build output
const distPath = path.join(__dirname, "artifacts/netco/dist");
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    res.status(404).json({ error: "Not Found" });
    return;
  }
  
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error("[v0] Error:", err);
  const status = err?.status ?? 500;
  const message = err?.message ?? "Internal server error";
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`[v0] Server listening on port ${PORT}`);
  console.log(`[v0] Frontend: http://localhost:${PORT}`);
  console.log(`[v0] API routes available at: http://localhost:${PORT}/api`);
});
