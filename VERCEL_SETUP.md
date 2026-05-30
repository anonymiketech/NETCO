# Vercel Deployment Setup Guide

## Current Architecture

Your NETCO platform is now deployed on Vercel with the following setup:

- **Frontend**: Vite React app deployed on Vercel
- **API Proxy**: Vercel serverless functions (API routes)
- **Backend**: Express API server (can be on Replit or another platform)

## Environment Variables to Configure

You need to add these environment variables in your Vercel project settings:

### 1. VITE_API_BASE_URL
**Purpose**: Tells the frontend where to send API requests

**Value**: `/api`

This is a relative path that points to your Vercel API routes (`/api/...`).

### 2. VITE_API_BACKEND_URL
**Purpose**: Tells the API proxy where to forward requests to your actual backend

**Options**:

#### If Backend is on Replit (Current Setup):
```
https://your-replit-project-name.replit.dev
```

Find this URL by:
1. Going to your Replit project
2. Looking at the URL in the browser address bar
3. It looks like: `https://project-name.replit.dev`

#### If Backend is Somewhere Else:
```
https://your-api-domain.com
```

Replace with your actual API server URL.

## How It Works

```
User Browser
    ↓
[Frontend on Vercel]
    ↓
Makes request to: /api/admin/servers/metadata
    ↓
[Vercel API Route Handler] (/api/[[...path]].ts)
    ↓
Proxies to: ${VITE_API_BACKEND_URL}/admin/servers/metadata
    ↓
[Your Backend API Server]
    ↓
Returns response back through proxy to frontend
```

## Step-by-Step Setup

1. **Go to Vercel Project Settings**
   - Login to vercel.com
   - Select your `netco-platform` project
   - Click "Settings" → "Environment Variables"

2. **Add VITE_API_BASE_URL**
   - Key: `VITE_API_BASE_URL`
   - Value: `/api`
   - Select all environments (Production, Preview, Development)
   - Click "Save"

3. **Add VITE_API_BACKEND_URL**
   - Key: `VITE_API_BACKEND_URL`
   - Value: Your backend URL (e.g., `https://netco-api.replit.dev`)
   - Select all environments
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click the latest deployment
   - Click "Redeploy" button
   - Wait for build to complete

## Troubleshooting

### Error: "API returned 405"
- Check that `VITE_API_BACKEND_URL` is correctly set
- Verify your backend server is running
- Check that the backend URL is accessible from the internet

### Error: "Cannot reach API"
- Ensure `VITE_API_BACKEND_URL` is a complete URL with `https://`
- Check for typos in the domain name
- Verify backend server is running and accessible

### API calls still not working
- Open browser DevTools → Network tab
- Look for failed `/api/*` requests
- Check the response - it should show which backend URL was used
- Verify both environment variables are set correctly

## API Endpoints

All your existing API endpoints work automatically:

- POST `/api/admin/servers/metadata` - Save server metadata
- POST `/api/admin/servers` - Upload server config
- GET `/api/admin/servers` - List servers
- GET `/api/admin/stats` - Get admin statistics
- And all other endpoints...

The proxy transparently forwards all requests to your backend API.

## Security Notes

- The proxy forwards all headers (except 'host')
- Request body is preserved
- All HTTP methods are supported
- Add authentication headers as needed in your frontend code

## Next Steps

Once you configure the environment variables:
1. Redeploy your project on Vercel
2. Test file upload in the admin panel
3. Monitor for any API errors

Your platform should now work end-to-end on Vercel!
