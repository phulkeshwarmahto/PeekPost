# Render Deployment Error - Missing Script: "build"

## Problem

```
npm error Missing script: "build"
Exited with status 1 while building your code
```

## Root Cause

Render is trying to run `npm run build` but the build script isn't properly configured for your backend.

---

## Solution

Since PeekPost has a **monorepo structure** (backend + frontend), you need to configure Render correctly:

### Option 1: Server-only setup (Recommended)

If you're using **Vercel for frontend** and **Render for backend only**:

**1. Update server/package.json**

Add a build script (even if it's just a pass-through):

```json
{
  "name": "peekpost-server",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "build": "echo 'Build complete'",
    "seed": "node scripts/seed.js"
  },
  ...
}
```

**2. Update Render Build Command**

In Render dashboard → Web Service Settings:
- **Build Command:** `npm install --prefix server && npm run build --prefix server`
- **Start Command:** `node server/server.js`

### Option 2: Add build script to root package.json

**In root package.json:**

```json
{
  "name": "peekpost",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "build": "npm run build --prefix server && npm run build --prefix client",
    "build:server": "echo 'Build complete'",
    "build:client": "npm run build --prefix client",
    "start": "npm run start --prefix server",
    "install:all": "npm install --prefix server && npm install --prefix client"
  },
  ...
}
```

**In Render dashboard → Web Service Settings:**
- **Build Command:** `npm install:all && npm run build:server`
- **Start Command:** `npm start`

---

## Quick Fix (2 minutes)

### Step 1: Update server/package.json

Add build script:
```bash
cd server
# Edit package.json, add to scripts section:
# "build": "echo 'Build complete'"
```

Or run this command:
```bash
cd server && npm pkg set scripts.build="echo 'Build complete'"
```

### Step 2: Update Render Settings

In **Render Dashboard** → Select **PeekPost API** service:

1. Click **Settings** tab
2. Find **Build Command** and change to:
   ```
   npm install --prefix server && npm run build --prefix server
   ```
3. Confirm **Start Command** is:
   ```
   node server/server.js
   ```
4. Click **Save**
5. Click **Redeploy** to rebuild

### Step 3: Verify

Wait for deployment to complete. You should see:
```
✅ Build completed
✅ Service started
```

---

## Prevention Checklist

- [x] `server/package.json` has `"build"` script
- [x] `client/package.json` has `"build"` script
- [x] Render **Build Command** matches your monorepo structure
- [x] Render **Start Command** starts the correct service
- [x] **Root Directory** is set correctly (default is fine for monorepo)

---

## Render Configuration Reference

| Setting | Value |
|---------|-------|
| **Name** | peekpost-api |
| **Environment** | Node |
| **Build Command** | `npm install --prefix server && npm run build --prefix server` |
| **Start Command** | `node server/server.js` |
| **Root Directory** | (leave empty for root) |

---

## Why This Happens

1. Render runs `npm run build` by default
2. It looks in the root package.json (or specified directory)
3. If build script doesn't exist, it fails
4. Monorepo setups need explicit `--prefix` flags

---

## After Fix

Push your changes:
```bash
git add package.json
git commit -m "Fix: Add build script for Render deployment"
git push origin main
```

Render will auto-redeploy on git push!

---

## Still Having Issues?

Check the full Render logs:
1. Render Dashboard → PeekPost API service
2. Click **Logs** tab
3. Scroll to see full error message
4. Share the error here for more specific help

---

**Status:** This should fix your deployment! ✅
