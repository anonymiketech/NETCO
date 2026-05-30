# NETCO Project Architecture Analysis

## Executive Summary

Your project uses a **HYBRID architecture with a SEPARATE Express backend** (Option 2).

- ❌ NOT Vercel API routes only
- ✅ REQUIRES a separate backend server (currently orphaned from Replit)
- ❌ VITE_API_BACKEND_URL is referenced but currently not properly configured

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (Deployed on Vercel)              │
│         https://netcom.anonymiketech.online             │
│                                                         │
│  - React/Vite SPA                                      │
│  - Makes API calls to `/api/*`                         │
│  - Uses VITE_API_BASE_URL env var (defaults to `/api`) │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓ (all requests to /api/*)
┌─────────────────────────────────────────────────────────┐
│     Vercel API Proxy (/api/[[...path]].ts)             │
│                                                         │
│  - Catches all /api/* requests                         │
│  - Forwards to VITE_API_BACKEND_URL                    │
│  - Acts as bridge between frontend and backend        │
│  - Requires VITE_API_BACKEND_URL to be set             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓ (proxies to backend)
┌─────────────────────────────────────────────────────────┐
│       Express Backend Server (/artifacts/api-server)    │
│            ⚠️ CURRENTLY NOT DEPLOYED                    │
│                                                         │
│  - Node.js/Express server                              │
│  - Handles all business logic                          │
│  - Connects to Supabase database                       │
│  - Has 13 route files with comprehensive endpoints     │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              Supabase Database (PostgreSQL)             │
│           Authentication & Data Persistence             │
└─────────────────────────────────────────────────────────┘
```

---

## VITE_API_BACKEND_URL References

### WHERE IT'S REFERENCED:

1. **`api/[[...path]].ts`** (Line 13)
   ```typescript
   const backendUrl = process.env.VITE_API_BACKEND_URL;
   
   if (!backendUrl) {
     return res.status(500).json({
       error: "Configuration Error",
       message: "VITE_API_BACKEND_URL environment variable is not set",
     });
   }
   ```
   - This is the Vercel proxy handler
   - It REQUIRES `VITE_API_BACKEND_URL` to be set
   - Currently returns 500 error if not configured

2. **`artifacts/netco/src/lib/api.ts`** (Line 3)
   ```typescript
   const raw = import.meta.env.VITE_API_BASE_URL;
   export const API_BASE = raw ? raw.replace(/\/+$/, "") : "";
   ```
   - This is the FRONTEND API base URL (different from backend URL)
   - Controls where frontend sends requests
   - Defaults to empty string (which means relative paths `/api/*`)

3. **`artifacts/netco/.env.production`**
   ```
   VITE_API_BASE_URL=/api
   ```
   - Tells frontend to use `/api` relative paths
   - These `/api` requests go to Vercel proxy

4. **Documentation files** (VERCEL_DEPLOYMENT.md, VERCEL_ENV_SETUP.txt)
   - Explain how to configure the environment variables

---

## The Problem: Broken Connection

Your project is currently **broken** because:

```
Frontend → /api/* → Vercel Proxy → VITE_API_BACKEND_URL (NOT SET) → ❌ 500 Error
```

### What's Missing:
- **VITE_API_BACKEND_URL** is not set in Vercel environment variables
- Express backend server is not deployed anywhere
- Vercel proxy has nowhere to forward requests

---

## Express Backend Details

The backend is NOT a Vercel API route. It's a complete Express application with:

### Backend Routes (13 files):
1. **admin-servers.ts** - Config server management (uploads, metadata)
2. **admin-orders.ts** - Order fulfillment for admins
3. **admin-announcements.ts** - Broadcast messages
4. **auth-email.ts** - Email authentication
5. **auth-profile.ts** - User profile management
6. **contact.ts** - Contact form submissions
7. **health.ts** - Server health checks
8. **index.ts** - Route aggregation
9. **orders.ts** - User order management
10. **packages.ts** - VPN package listings
11. **payment.ts** - Payment processing (M-Pesa likely)
12. **plans.ts** - Plan information
13. **stats.ts** - Platform statistics

### Backend Stack:
- Framework: Express.js
- Database: Supabase (PostgreSQL)
- ORM: Drizzle ORM
- Auth: Better Auth
- File Storage: Supabase Storage (for .hc config files)
- Middleware: CORS, multer (file uploads), custom JSON parser

---

## Why You NEED Separate Backend

This is NOT a simple SPA. The backend handles:

1. **File Uploads** - Config files to Supabase Storage
2. **Database Operations** - Complex Drizzle ORM queries to PostgreSQL
3. **Business Logic** - Order fulfillment, payments, authentication
4. **Supabase Integration** - Authentication, storage, database
5. **M-Pesa Payments** - Payment processing
6. **Admin Functions** - Server management, order processing

**You cannot do this with Vercel API routes alone** because:
- Vercel Functions are stateless and ephemeral
- File uploads need proper handling
- Complex database queries need persistent connections
- Payment processing needs external service integration

---

## How the Frontend Communicates

### Frontend API Calls:

```typescript
// From lib/api.ts
const API_BASE = "/api"  // When VITE_API_BASE_URL is not set

// From pages
import { apiUrl } from "@/lib/api";

// Makes calls like:
fetch(apiUrl("/api/admin/orders"))  // → /api/admin/orders
fetch(apiUrl("/api/packages"))      // → /api/packages
fetch(apiUrl("/api/auth/profile"))  // → /api/auth/profile
```

The `apiUrl()` function prepends `API_BASE` to paths, so requests go to `/api/*`.

### How It Gets to Backend:

```
Frontend fetch("/api/admin/orders")
  ↓
Browser sends POST to /api/admin/orders
  ↓
Vercel catches with /api/[[...path]].ts
  ↓
Proxies to: VITE_API_BACKEND_URL + "/api/admin/orders"
  ↓
Example: https://your-backend.com/api/admin/orders
```

---

## What's Currently Happening

Since the Express backend is not deployed:

1. ❌ Vercel proxy can't find `VITE_API_BACKEND_URL`
2. ❌ Returns 500 "VITE_API_BACKEND_URL not set" error
3. ❌ All API calls fail
4. ❌ Users can't upload servers, place orders, authenticate, etc.

---

## What You MUST Do to Fix

You have TWO options:

### Option A: Re-Deploy Backend to Replit (SIMPLEST)
1. Go back to Replit
2. Deploy the `/artifacts/api-server` there
3. Get the Replit URL (e.g., `https://netco-api.replit.dev`)
4. Add to Vercel: `VITE_API_BACKEND_URL=https://netco-api.replit.dev`
5. Redeploy frontend on Vercel

### Option B: Deploy Backend Elsewhere
Deploy `/artifacts/api-server` to:
- Render.com (free tier available)
- Railway (requires payment)
- Fly.io
- AWS EC2
- DigitalOcean
- Any Node.js hosting

Then set `VITE_API_BACKEND_URL` to that server's URL.

### Option C: Migrate Backend to Vercel (NOT RECOMMENDED)
Converting the Express backend to Vercel functions would be complex and time-consuming. Not worth it.

---

## Summary Table

| Aspect | Current State | Required |
|--------|---------------|----------|
| Frontend | ✅ Deployed on Vercel | ✅ Ready |
| Vercel Proxy | ✅ Configured | ✅ Ready |
| Express Backend | ❌ Not deployed | ✅ REQUIRED |
| VITE_API_BASE_URL | ✅ Set to `/api` | ✅ Correct |
| VITE_API_BACKEND_URL | ❌ NOT SET | ✅ MUST ADD |
| Supabase DB | ✅ Connected | ✅ Ready |

---

## Recommendation

**Re-deploy the Express backend to Replit** (where it came from). This is the fastest way to get your app working:

1. Easiest - just reactivate Replit
2. Cheapest - Replit free tier works
3. Already configured - no code changes needed
4. All secrets already there - Supabase keys, auth, etc.

Then your app will work end-to-end again.

