import { VercelRequest, VercelResponse } from '@vercel/node';

// Import the Express app
import app from '../artifacts/api-server/src/app';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle the request with the Express app
  return new Promise<void>((resolve) => {
    // Call Express app as middleware
    app(req as any, res as any, () => {
      resolve();
    });
  });
}
