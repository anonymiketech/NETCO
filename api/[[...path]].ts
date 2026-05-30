import { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Catch-all API route handler that proxies requests to the backend API server
 * This acts as a bridge between the Vercel frontend and your backend API
 */

const API_BACKEND_URL = process.env.VITE_API_BACKEND_URL || "http://localhost:8080";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Get the path from the catch-all route
    const pathArray = req.query.path as string[];
    const path = pathArray ? `/${pathArray.join("/")}` : "/";

    // Build the full URL to the backend
    const backendUrl = `${API_BACKEND_URL}${path}`;

    // Log for debugging (remove in production)
    console.log(`[API Proxy] ${req.method} ${path} -> ${backendUrl}`);

    // Prepare request options
    const requestOptions = {
      method: req.method,
      headers: {
        ...req.headers,
        // Remove host header to avoid conflicts
        host: new URL(backendUrl).hostname,
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
    };

    // Make the request to the backend
    const response = await fetch(backendUrl, requestOptions as RequestInit);

    // Get response data
    const data = await response.text();

    // Copy headers from backend response
    Object.entries(response.headers.raw?.() || {}).forEach(([key, value]) => {
      // Skip certain headers that shouldn't be proxied
      if (!["content-encoding", "transfer-encoding"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // Set status code and send response
    res.status(response.status);
    
    // Try to parse as JSON, otherwise send as text
    try {
      res.json(JSON.parse(data));
    } catch {
      res.send(data);
    }
  } catch (error) {
    console.error("[API Proxy Error]", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
