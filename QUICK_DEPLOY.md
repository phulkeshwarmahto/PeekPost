# PeekPost Quick Deployment Reference

## 30-Minute Deployment Summary

### 1. Prepare GitHub Repository (5 min)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy Frontend to Vercel (10 min)

1. Go to https://vercel.com/new
2. Import repository → Select `peekpost`
3. Configure:
   - Root Directory: `./client`
   - Build: `npm run build`
4. Add environment:
   ```
   VITE_API_BASE_URL=https://peekpost-api.onrender.com/api
   VITE_SOCKET_URL=https://peekpost-api.onrender.com
   ```
5. Click Deploy → Wait for completion
6. Save your frontend URL: `https://peekpost-xxx.vercel.app`

### 3. Deploy Backend to Render (15 min)

1. Go to https://render.com/dashboard
2. New → Web Service → Connect GitHub
3. Select `peekpost` repository
4. Configure:
   - Name: `peekpost-api`
   - Environment: `Node`
   - Build: `npm install --prefix server`
   - Start: `node server/server.js`
   - Plan: Starter ($7/mo) for production
5. Add environment variables:
   ```
   DB_URI=<MongoDB connection string>
   REDIS_URL=<Redis Cloud URL>
   JWT_SECRET=<generate random string>
   CLOUDINARY_NAME=<your value>
   CLOUDINARY_API_KEY=<your value>
   CLOUDINARY_API_SECRET=<your value>
   RAZORPAY_KEY_ID=<your value>
   RAZORPAY_KEY_SECRET=<your value>
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your email>
   SMTP_PASS=<Gmail app password>
   SMTP_FROM=noreply@peekpost.com
   CLIENT_URL=<your Vercel URL>
   NODE_ENV=production
   JWT_EXPIRE=7d
   ```
6. Click Deploy → Wait for completion
7. Save your backend URL: `https://peekpost-api.onrender.com`

### 4. Update Frontend with Backend URL (5 min)

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Update:
   ```
   VITE_API_BASE_URL=https://peekpost-api.onrender.com/api
   VITE_SOCKET_URL=https://peekpost-api.onrender.com
   ```
3. Go to Deployments → Redeploy latest

## Service URLs After Deployment

| Service | URL |
|---------|-----|
| **Frontend** | https://peekpost-xxx.vercel.app |
| **Backend** | https://peekpost-api.onrender.com |
| **API Health** | https://peekpost-api.onrender.com/api/health |

## Critical Environment Variables

### Backend (Render)
```
# Database
DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/peekpost

# Cache
REDIS_URL=redis://:password@host:port

# Security
JWT_SECRET=generate_a_random_unique_string
JWT_EXPIRE=7d

# Services (get from respective dashboards)
CLOUDINARY_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
RAZORPAY_KEY_ID=xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=google_app_password

# Frontend URL
CLIENT_URL=https://peekpost-xxx.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://peekpost-api.onrender.com/api
VITE_SOCKET_URL=https://peekpost-api.onrender.com
```

## Test Deployment

```bash
# Test backend
curl https://peekpost-api.onrender.com/api/health

# Open frontend
https://peekpost-xxx.vercel.app
```

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| CORS errors | Check `CLIENT_URL` in Render env vars |
| Connection refused | Render free tier spins down - upgrade to Starter |
| Database timeout | Check MongoDB IP whitelist (allow 0.0.0.0/0) |
| Socket.io fails | Ensure HTTPS URLs (not HTTP) |
| Images not uploading | Verify Cloudinary credentials |
| Emails not sending | Generate Gmail App Password (not regular password) |

## Keep Backend Always Running

Option 1: Upgrade to Render Starter ($7/month)
- Auto-scaling
- Always on
- Recommended for production

Option 2: Free tier + Uptime monitoring
- Free service spins down after 15 min inactivity
- Use UptimeRobot to ping every 10 min
- Not recommended for production

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Render
3. ✅ Test all features in production
4. ⏭️ Monitor logs in dashboards
5. ⏭️ Set up custom domain (optional)
6. ⏭️ Enable analytics
7. ⏭️ Plan for scaling

## Useful Commands

```bash
# View Render logs
# Dashboard → Your Service → Logs

# View Vercel logs
vercel logs

# Redeploy if needed
# Vercel: Dashboard → Deployments → Redeploy
# Render: Dashboard → Events → Redeploy

# View environment variables
# Vercel: Settings → Environment Variables
# Render: Environment tab
```

## Support Links

- Vercel Issues: https://vercel.com/docs/platform/frequently-asked-questions
- Render Issues: https://render.com/docs
- MongoDB: https://docs.atlas.mongodb.com
- Redis: https://redis.com/try-free/

---

**⚠️ IMPORTANT NOTES:**

1. **Never commit `.env` to GitHub** - Use `.env.example` instead
2. **Keep secrets secure** - Use strong, random JWT_SECRET
3. **Enable 2FA on all accounts** - Google, MongoDB, Render, Vercel
4. **Use HTTPS in production** - Both platforms auto-provision SSL
5. **Monitor logs regularly** - Check for errors and performance issues
6. **Backup database regularly** - Set up MongoDB backups
7. **Test thoroughly before going live** - Especially payment flows

---

**Status:** ✅ Ready to deploy  
**Last Updated:** April 2026
