# PeekPost Deployment Guide: Vercel + Render

Complete guide for deploying PeekPost with Vercel (frontend) and Render (backend).

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Vercel Frontend Deployment](#vercel-frontend-deployment)
3. [Render Backend Deployment](#render-backend-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database & Services Setup](#database--services-setup)
6. [Post-Deployment Setup](#post-deployment-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- **GitHub account** - Both Vercel and Render support GitHub integration
- **Vercel account** - Free tier available at https://vercel.com
- **Render account** - Free tier available at https://render.com
- **MongoDB Atlas account** - Cloud database at https://www.mongodb.com/cloud/atlas
- **Redis Cloud account** - Cache/session management at https://redis.com/cloud/
- **Cloudinary account** - Image hosting at https://cloudinary.com
- **Razorpay account** - Payment processing at https://razorpay.com

**Push your repository to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/peekpost.git
git push -u origin main
```

---

## Vercel Frontend Deployment

### Step 1: Connect Your Repository to Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Select **Import Git Repository**
4. Search for `peekpost` and click **Import**
5. Select **Continue**

### Step 2: Configure Project Settings

1. **Project Name:** `peekpost` (or your preferred name)
2. **Framework Preset:** Select **Vite**
3. **Root Directory:** Click **Edit** and select `./client`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Install Command:** `npm install`

### Step 3: Set Environment Variables

Click **Environment Variables** and add:

```
VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com
VITE_SOCKET_URL=https://YOUR_BACKEND_URL.onrender.com
```

> **Note:** Use `https://` URLs. Get your Render backend URL after deploying the backend.

**Development URL format:**
- Local: `http://localhost:5000`
- Production: `https://your-server-name.onrender.com`

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build completion (2-5 minutes)
3. Your frontend will be live at `https://peekpost-XXXXXXXXXX.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `peekpost.com`)
3. Update DNS records according to Vercel's instructions

---

## Render Backend Deployment

### Step 1: Prepare Your Backend

Ensure your `server/.env` has the proper structure (we'll set values in Render):

```env
PORT=5000
DB_URI=mongodb+srv://...
REDIS_URL=redis://...
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@peekpost.com
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Step 2: Create a Render Web Service

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Select **Connect a repository** (or paste GitHub repo URL)
4. Find and select `peekpost` repository
5. Click **Connect**

### Step 3: Configure Web Service

Fill in the following:

- **Name:** `peekpost-api` (or your preferred name)
- **Environment:** `Node`
- **Region:** Select closest to your users
- **Build Command:** `npm install --prefix server`
- **Start Command:** `node server/server.js`
- **Plan:** `Free` (or upgrade to `Starter` for better performance)

### Step 4: Set Environment Variables

Click **Environment** and add all variables from your `.env`:

```
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/peekpost
REDIS_URL=redis://:password@redis-host:port
JWT_SECRET=generate_a_random_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@peekpost.com
JWT_EXPIRE=7d
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
NODE_ENV=production
PORT=5000
```

### Step 5: Deploy

1. Click **Create Web Service**
2. Wait for deployment (2-10 minutes)
3. Your backend will be live at `https://peekpost-api.onrender.com`

### Important: Keep Your Service Running (Free Plan)

On Render's free tier, services spin down after 15 minutes of inactivity:

**Option A: Upgrade to Starter Plan** ($7/month)
- Keeps services always running
- Recommended for production

**Option B: Keep Free Service Alive**
- Set up a monitoring service (e.g., UptimeRobot)
- Ping your backend every 10 minutes

---

## Environment Configuration

### Update Frontend with Backend URL

After deploying the backend, update the frontend environment variables:

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Edit and update:
   ```
   VITE_API_URL=https://peekpost-api.onrender.com
   VITE_SOCKET_URL=https://peekpost-api.onrender.com
   ```
3. Redeploy: Click **Deployments** → **Redeploy** on the latest deployment
4. Or make a new commit to trigger automatic redeploy

### Verify in Client Code

Check [client/src/services/api.js](client/src/services/api.js):
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## Database & Services Setup

### 1. MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free tier available)
3. Create a database user with strong password
4. Get connection string:
   - Click **Connect** → **Drivers**
   - Copy the connection string
   - Replace `<password>` and `<database>` with your credentials
5. Set `DB_URI` in both environments:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/peekpost?retryWrites=true&w=majority
   ```

### 2. Redis Cloud Setup

1. Go to https://redis.com/cloud/
2. Create a free database
3. Copy the connection string from **Connection Details**
4. Set `REDIS_URL` in Render:
   ```
   redis://:yourpassword@redis-18xxx.c123.us-east-1-2.ec2.cloud.redis.io:12xxx
   ```

### 3. Cloudinary Setup

1. Go to https://cloudinary.com
2. Copy your **Cloud Name** from dashboard
3. Generate API Key and Secret from **Account Settings** → **API Keys**
4. Set in Render:
   ```
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=xxxxxxxxxxxxx
   CLOUDINARY_API_SECRET=xxxxxxxxxxxxx
   ```

### 4. Razorpay Setup

1. Go to https://razorpay.com
2. Get API Key and Secret from **Settings** → **API Keys**
3. Set in Render:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
   ```

### 5. Email Service Setup (Gmail)

1. Enable **2-Factor Authentication** on your Gmail account
2. Generate an **App Password**: https://myaccount.google.com/apppasswords
3. Set in Render:
   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_generated_app_password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_FROM=noreply@peekpost.com
   ```

---

## Post-Deployment Setup

### 1. Verify Deployment

Check if your services are working:

```bash
# Test backend API
curl https://peekpost-api.onrender.com/api/health

# Test frontend
# Visit https://peekpost-xxxxxx.vercel.app in your browser
```

### 2. Run Database Seeding (Optional)

To populate initial data:

1. In Render, go to **Shell** tab
2. Run:
   ```bash
   npm run seed --prefix server
   ```

Or via SSH:
```bash
ssh -i your_key render@your-service.onrender.com
cd server
npm run seed
```

### 3. Set Up CORS

Your backend already has CORS configured. Verify in [server/app.js](server/app.js):

```javascript
const ALLOWED_ORIGINS = [
  'https://peekpost-xxxxxx.vercel.app', // Your Vercel domain
  'http://localhost:3000', // Local development
  'http://localhost:5173'  // Vite dev server
];
```

### 4. Configure CSRF Protection

If using CSRF tokens, whitelist your Vercel domain in:
[server/middlewares/csrf.middleware.js](server/middlewares/csrf.middleware.js)

### 5. Set Up SSL/TLS

Both Vercel and Render provide free SSL certificates automatically. Verify:
- Frontend: Should show 🔒 in browser
- Backend: Check `https://peekpost-api.onrender.com` in browser

---

## Domain Configuration (Optional)

### Connect Custom Domain to Vercel

1. **In Vercel Dashboard:**
   - Settings → Domains
   - Add `peekpost.com`
   - Follow DNS setup instructions

2. **Update Your DNS Provider (GoDaddy, Namecheap, etc.):**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Apex Domain (peekpost.com without www):**
   ```
   Type: A
   Name: @
   Value: 76.76.19.0 (or value provided by Vercel)
   ```

### Connect Custom Domain to Render

1. **In Render Dashboard:**
   - Settings → Custom Domain
   - Add `api.peekpost.com`
   - Follow DNS setup instructions

2. **Update Your DNS Provider:**
   ```
   Type: CNAME
   Name: api
   Value: peekpost-api.onrender.com
   ```

---

## Monitoring & Debugging

### Vercel Logs

```bash
# View deployment logs
vercel logs --all

# View production logs
vercel logs https://peekpost-xxxxxx.vercel.app
```

### Render Logs

1. Go to your Web Service in Render dashboard
2. Click **Logs** tab
3. View real-time and historical logs

### Monitor Performance

- **Vercel Analytics:** https://vercel.com/docs/analytics
- **Render Metrics:** Available in service dashboard

### Enable Debug Mode

In Render environment variables, add:
```
DEBUG=peekpost:*
```

---

## Troubleshooting

### Issue: "Connection Refused" when accessing backend

**Solution:**
1. Check if Render service is running (not spun down)
2. Upgrade to Starter plan or set up uptime monitoring
3. Check MongoDB and Redis connections in Render logs

### Issue: CORS errors

**Solution:**
1. Update `CLIENT_URL` in Render environment to match Vercel URL
2. Add `VITE_API_URL` to Vercel environment
3. Redeploy both services

### Issue: Socket.io connection fails

**Solution:**
1. Ensure `VITE_SOCKET_URL` matches your Render backend URL
2. Both must use `https://` in production
3. Check firewall settings on Render

### Issue: Database connection timeout

**Solution:**
1. Verify `DB_URI` is correct in Render
2. Check MongoDB Atlas IP whitelist: allow `0.0.0.0/0` (or specific IPs)
3. Test connection:
   ```bash
   mongosh "YOUR_CONNECTION_STRING"
   ```

### Issue: Environment variables not updating

**Solution:**
1. After updating env vars in Render/Vercel, redeploy
2. Vercel: Click on deployment → Redeploy
3. Render: Automatic on env var changes (may take 1-2 min)

### Issue: Redis connection fails

**Solution:**
1. Verify Redis URL format: `redis://:password@host:port`
2. Check Redis Cloud whitelist IP settings
3. Test locally first:
   ```bash
   redis-cli -u "redis://:password@host:port" PING
   ```

### Issue: Images not uploading (Cloudinary)

**Solution:**
1. Verify Cloudinary credentials in Render env vars
2. Check upload folder permissions in Cloudinary dashboard
3. Review Cloudinary request logs for errors

---

## Performance Optimization

### Frontend Optimization

1. **Enable Vercel Analytics:**
   ```bash
   vercel analytics enable
   ```

2. **Optimize Images:**
   - Use Vercel's Image Optimization
   - Replace `<img>` with `<Image>` from `next/image`

3. **Code Splitting:**
   - Vite automatically handles this
   - Monitor bundle size: `vite build --analyze`

### Backend Optimization

1. **Database Indexing:**
   - Create indexes on frequently queried fields
   - See [server/models/](server/models/) for index definitions

2. **Redis Caching:**
   - Cache frequently accessed data
   - Set appropriate TTL values

3. **Compression:**
   - Already enabled via `helmet` middleware
   - Check: `Accept-Encoding: gzip`

---

## Continuous Deployment

### Auto-Deploy on GitHub Push

Both Vercel and Render automatically deploy when you push to your main branch:

1. **Make changes locally**
2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```
3. **Vercel & Render automatically deploy**
4. **View deployment status in their dashboards**

### Rollback Deployment

**Vercel:**
1. Go to Deployments
2. Find previous deployment
3. Click "Promote to Production"

**Render:**
1. Go to Logs/Events
2. Find previous deployment
3. Click "Redeploy" on that commit

---

## Security Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Enable 2FA on all cloud service accounts
- [ ] Use environment variables for all secrets
- [ ] Set CORS whitelist to specific domains
- [ ] Enable rate limiting on API endpoints
- [ ] Use HTTPS everywhere (automatic on both platforms)
- [ ] Regularly update dependencies
- [ ] Set up monitoring and alerts
- [ ] Implement request logging

---

## Scaling Considerations

When your app grows:

1. **Upgrade Plans:**
   - Vercel: Standard → Pro ($20/month)
   - Render: Free → Starter ($7/month) → Pro ($24+/month)

2. **Database Scaling:**
   - MongoDB: Upgrade cluster tier
   - Redis: Upgrade Redis Cloud plan

3. **CDN & Caching:**
   - Enable Vercel's automatic caching
   - Use Redis for session storage

4. **Load Balancing:**
   - Render handles automatically
   - Monitor response times in dashboard

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **MongoDB Atlas Help:** https://docs.atlas.mongodb.com
- **Socket.io Deployment:** https://socket.io/docs/v4/server-with-multiple-nodes/

---

## Quick Reference

| Service | URL | Plan | Cost |
|---------|-----|------|------|
| Frontend (Vercel) | https://peekpost-xxx.vercel.app | Hobby/Free | $0 |
| Backend (Render) | https://peekpost-api.onrender.com | Free/Starter | $0-7 |
| Database (MongoDB) | Atlas | Shared/M0 | $0 |
| Cache (Redis) | Redis Cloud | 30MB Free | $0 |
| Images (Cloudinary) | Cloud | Free | $0 |
| Payments (Razorpay) | - | Pay per transaction | Variable |

---

**Last Updated:** April 2026  
**Status:** ✅ Ready for production deployment
