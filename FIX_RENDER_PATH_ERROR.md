# Render Deployment Error - ENOENT: Cannot find package.json

## Problem

```
npm error path /opt/render/project/src/server/server/package.json
npm error ENOENT: no such file or directory
```

Render is looking in the wrong path - it's looking for `server/server/package.json` instead of `server/package.json`.

## Root Cause

Your **Root Directory** or **Publish Directory** setting in Render is incorrect and causing the path to be nested twice.

---

## Solution

### Step 1: Fix Render Configuration

1. Go to **Render Dashboard** → **PeekPost API** service
2. Click **Settings** tab
3. Fix these fields:

| Field | Value |
|-------|-------|
| **Root Directory** | Leave **BLANK** (don't enter anything) |
| **Publish Directory** | Leave **BLANK** (don't enter anything) |
| **Build Command** | `npm install --prefix server && npm run build --prefix server` |
| **Start Command** | `node server/server.js` |

### Step 2: Clear Any Wrong Values

If you have values in:
- ❌ Root Directory: `src/` or `server/` 
- ❌ Publish Directory: `server/` or `src/server/`

**Delete these values** - leave them completely blank.

### Step 3: Save and Redeploy

1. Click **Save Changes**
2. Click **Redeploy** button (red at top)
3. Wait for build to complete

---

## Why This Happens

When you set Root Directory to `src/server/`, Render does:
```
Base Path: /opt/render/project/src/server/
Build Command Prefix: --prefix server
Result: /opt/render/project/src/server/server/package.json ❌ WRONG
```

When you leave it blank:
```
Base Path: /opt/render/project/
Build Command Prefix: --prefix server
Result: /opt/render/project/server/package.json ✅ CORRECT
```

---

## Verification Checklist

After fixing, verify:
- [ ] Root Directory is **BLANK**
- [ ] Publish Directory is **BLANK**
- [ ] Build Command: `npm install --prefix server && npm run build --prefix server`
- [ ] Start Command: `node server/server.js`
- [ ] Click **Save Changes**
- [ ] Click **Redeploy**

---

## Alternative Solution (Simpler)

If the above doesn't work, try this simpler approach:

### Update Root Package.json Start Script

Edit root `package.json`:
```json
{
  "scripts": {
    "start": "npm start --prefix server"
  }
}
```

### Render Configuration (Simplified)

| Field | Value |
|-------|-------|
| **Root Directory** | Leave **BLANK** |
| **Publish Directory** | Leave **BLANK** |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

This way Render:
1. Installs root dependencies
2. Runs `npm start` from root
3. Root package.json redirects to `npm start --prefix server`
4. Server starts properly

---

## Expected Success Output

After redeploy completes, you should see:
```
✅ npm install completed
✅ npm run build completed
✅ Server running on port 5000
```

---

## Still Having Issues?

### Check Render Logs

1. Go to **Events** tab in Render
2. Click the failed deployment
3. Click **Logs** to see full error
4. Share the error

### Quick Debug

Try simplified build command:
```
npm install && npm run build
```

Then start command:
```
npm start
```

This uses root package.json which should work, but you'll need to ensure root package.json starts the server.

---

**After fixing Root Directory, your deployment should succeed!** ✅
