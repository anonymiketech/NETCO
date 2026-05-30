# Vercel Deployment Guide for NETCO

## Overview

Your NETCO application is now configured for Vercel deployment with a clean separation between frontend and backend:

- **Frontend**: Vite React app (artifacts/netco) deployed on Vercel
- **Backend API**: Express server (artifacts/api-server) - can be deployed anywhere
- **API Proxy**: Vercel serverless function (api/[[...path]].ts) proxies requests

## Vercel Environment Variables Setup

You **MUST** configure these environment variables in your Vercel project:

### Required Variables

1. **VITE_API_BACKEND_URL** (Required)
   - **Purpose**: Tells the API proxy where your backend server is running
   - **Example values**:
     - `https://your-replit.replit.dev` (if backend is on Replit)
     - `https://api.yourdomain.com` (if backend is on separate server)
     - `http://localhost:8080` (for local testing)
   - **How to set**: 
     - Go to Vercel Project → Settings → Environment Variables
     - Add new variable: Key = `VITE_API_BACKEND_URL`, Value = your backend URL
     - Select: All Environments (Production, Preview, Development)
     - Save and redeploy

2. **VITE_API_BASE_URL** (Optional - already configured)
   - **Default**: `/api` (frontend knows to use relative API paths)
   - **Pre-configured**: Already set in `.env.production`
   - **Only change if**: You want a different API base path

### Database Variables (Already Set)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Other Supabase and database variables

## How It Works

```
User Browser
    ↓
Frontend (Vercel) - netcom.anonymiketech.online
    ↓
Makes request to /api/admin/servers
    ↓
Vercel API Route (api/[[...path]].ts)
    ↓
Proxies to VITE_API_BACKEND_URL + path
    ↓
Your Backend Server (Replit or elsewhere)
    ↓
Processes request, returns response
    ↓
Back through proxy to frontend
```

## Deployment Steps

### 1. Configure Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your `netco-platform` project
3. Click **Settings** → **Environment Variables**
4. Add `VITE_API_BACKEND_URL` with your backend server URL
5. Select all environments (Production, Preview, Development)
6. Click **Save**

### 2. Deploy to Vercel

Option A: Automatic (Connected to GitHub)
- Push changes to GitHub
- Vercel automatically deploys

Option B: Manual Redeploy
- Go to Deployments tab
- Click the three dots next to latest deployment
- Click "Redeploy"
- Wait for build to complete

### 3. Test the Deployment

1. Visit https://netcom.anonymiketech.online
2. Try uploading a config server
3. Check browser console for any errors
4. If errors, check Vercel logs: Project → Logs → Deployments

## Backend Server Options

### Option 1: Keep Backend on Replit (Recommended for now)

1. Ensure your API server is running on Replit
2. Get your Replit URL (e.g., `https://netco-api.replit.dev`)
3. Set `VITE_API_BACKEND_URL=https://netco-api.replit.dev` in Vercel

### Option 2: Migrate Backend to Vercel Functions

More complex - requires converting Express routes to Vercel serverless functions. Contact support if interested.

### Option 3: Deploy Backend to Traditional Server

Deploy your Express API to AWS, Heroku, DigitalOcean, etc.

## Troubleshooting

### Error: "VITE_API_BACKEND_URL is not set"

**Solution**: Add the environment variable in Vercel and redeploy

### Error: 405 Method Not Allowed on API calls

**Possible causes**:
1. Backend server is down/unreachable
2. VITE_API_BACKEND_URL is incorrect
3. CORS issues - backend doesn't allow requests from Vercel domain

**Fix**:
- Verify backend is running
- Double-check VITE_API_BACKEND_URL value
- Ensure backend's CORS configuration allows your Vercel domain

### Error: File upload fails

**Solution**:
1. Check backend logs to see if request reaches it
2. Verify backend has Supabase credentials configured
3. Test backend directly by visiting the backend URL in browser

## Removed Replit Configuration

The following Replit-specific files and code have been removed:
- `.replit` configuration
- `.replitignore` file
- `server.ts` and `server.js` (Replit-specific servers)
- `serve-frontend.ts` (Replit frontend serving)
- Replit-specific Vite plugins

This ensures your project is clean and optimized for Vercel deployment.

## File Structure

```
/vercel/share/v0-project/
├── api/
│   └── [[...path]].ts          ← Vercel API proxy handler
├── artifacts/
│   ├── netco/                   ← Frontend (Vite React)
│   │   ├── .env.production      ← Sets VITE_API_BASE_URL=/api
│   │   └── vite.config.ts       ← Cleaned of Replit code
│   └── api-server/              ← Backend (Express)
│       ├── src/
│       │   ├── app.ts           ← Cleaned of frontend serving
│       │   ├── routes/
│       │   └── ...
│       └── package.json
├── vercel.json                  ← Vercel build config
└── package.json                 ← Root monorepo config
```

## Next Steps

1. **Verify your backend URL** - Where is your API server running?
2. **Set environment variable** - Add `VITE_API_BACKEND_URL` to Vercel
3. **Redeploy** - Trigger a redeploy in Vercel
4. **Test** - Try uploading a server config
5. **Monitor logs** - Check Vercel and backend logs for issues

## Support

If you encounter issues:
1. Check Vercel deployment logs: Project → Logs
2. Check backend logs: Check your backend server logs
3. Check browser console: F12 → Console tab for JavaScript errors
4. Verify CORS: Backend must allow requests from `netcom.anonymiketech.online`
