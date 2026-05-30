import { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Catch-all API route handler for Vercel deployment
 * This proxies API requests based on the VITE_API_BACKEND_URL environment variable
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Get backend URL from environment - must be set in Vercel
  const backendUrl = process.env.VITE_API_BACKEND_URL;
  
  if (!backendUrl) {
    return res.status(500).json({
      error: "Configuration Error",
      message: "VITE_API_BACKEND_URL environment variable is not set",
    });
  }

  try {
    // Get the path from the catch-all route
    const pathArray = req.query.path as string[];
    const path = pathArray ? `/${pathArray.join("/")}` : "/";

    // Build the full URL to the backend
    const fullUrl = `${backendUrl}${path}`;
    
    // Parse query string if present
    const searchParams = new URLSearchParams(req.query as Record<string, string>);
    const queryString = searchParams.toString();
    const urlWithQuery = queryString ? `${fullUrl}?${queryString}` : fullUrl;

    // Prepare request body
    let body: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    // Make the request to the backend
    const response = await fetch(urlWithQuery, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers["authorization"] && {
          authorization: req.headers["authorization"],
        }),
      },
      body,
    });

    // Get response data
    const responseText = await response.text();
    
    // Set status code
    res.status(response.status);
    
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    
    // Try to parse and return as JSON, otherwise return as text
    try {
      const jsonData = JSON.parse(responseText);
      res.json(jsonData);
    } catch {
      res.send(responseText);
    }
  } catch (error) {
    console.error("[API Proxy Error]", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
