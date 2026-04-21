# Vercel + Render Deployment Checklist

## Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] All environment variables identified
- [ ] Tested locally with production-like settings
- [ ] No sensitive data in code (use env vars)
- [ ] Dependencies updated: `npm install`
- [ ] Build tested locally: `npm run build`

## Vercel Deployment (Frontend)

### Account Setup
- [ ] Created Vercel account (vercel.com)
- [ ] Logged in with GitHub
- [ ] Connected GitHub repository

### Configuration
- [ ] Project name set to "peekpost"
- [ ] Root directory: `./client`
- [ ] Build command: `npm run build`
- [ ] Install command: `npm install`
- [ ] Output directory: `dist`

### Environment Variables (Vercel)
- [ ] `VITE_API_URL` = (will update after backend deployment)
- [ ] `VITE_SOCKET_URL` = (will update after backend deployment)

### Deployment
- [ ] Initial deployment successful
- [ ] Build logs reviewed for errors
- [ ] Frontend accessible at vercel URL
- [ ] No 404 or console errors

## Render Deployment (Backend)

### Account Setup
- [ ] Created Render account (render.com)
- [ ] Logged in with GitHub
- [ ] Connected GitHub repository

### Web Service Configuration
- [ ] Service name: "peekpost-api"
- [ ] Environment: Node
- [ ] Build command: `npm install --prefix server`
- [ ] Start command: `node server/server.js`
- [ ] Plan selected (Free or Starter)
- [ ] Region selected (closest to users)

### Environment Variables (Render)
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `DB_URI` = MongoDB connection string
- [ ] `REDIS_URL` = Redis Cloud URL
- [ ] `JWT_SECRET` = Generated random string
- [ ] `CLOUDINARY_NAME` = Your Cloudinary name
- [ ] `CLOUDINARY_API_KEY` = API key
- [ ] `CLOUDINARY_API_SECRET` = API secret
- [ ] `RAZORPAY_KEY_ID` = Razorpay key
- [ ] `RAZORPAY_KEY_SECRET` = Razorpay secret
- [ ] `SMTP_HOST=smtp.gmail.com`
- [ ] `SMTP_PORT=587`
- [ ] `SMTP_USER` = Your Gmail
- [ ] `SMTP_PASS` = App password from Google
- [ ] `SMTP_FROM=noreply@peekpost.com`
- [ ] `JWT_EXPIRE=7d`
- [ ] `CLIENT_URL` = Your Vercel frontend URL

### Deployment
- [ ] Initial deployment successful
- [ ] Build logs reviewed for errors
- [ ] Backend accessible at render URL
- [ ] API health check passes

## Third-Party Services

### MongoDB Atlas
- [ ] Account created at mongodb.com/cloud/atlas
- [ ] Cluster created (Free tier M0)
- [ ] Database user created with strong password
- [ ] Connection string obtained
- [ ] IP whitelist configured (allow 0.0.0.0/0 for cloud deployment)
- [ ] DB_URI set in Render

### Redis Cloud
- [ ] Account created at redis.com/cloud/
- [ ] Database created
- [ ] Connection string obtained
- [ ] REDIS_URL set in Render

### Cloudinary
- [ ] Account created at cloudinary.com
- [ ] Cloud name obtained
- [ ] API key and secret generated
- [ ] All values set in Render

### Razorpay
- [ ] Account created at razorpay.com
- [ ] API keys obtained
- [ ] Keys set in Render
- [ ] Webhook configured (if needed)

### Gmail (Email Service)
- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App password generated
- [ ] SMTP credentials set in Render

## Post-Deployment Verification

### Frontend Tests
- [ ] Frontend loads without errors
- [ ] All pages accessible
- [ ] Network requests go to Render backend
- [ ] WebSocket connection established
- [ ] Images load correctly
- [ ] Redux state persists
- [ ] No CORS errors in console

### Backend Tests
- [ ] API endpoints respond
- [ ] Database operations work
- [ ] Authentication/JWT works
- [ ] File uploads work
- [ ] Email sending works
- [ ] Socket.io messages transmit
- [ ] Rate limiting active

### Integration Tests
- [ ] User registration works
- [ ] User login works
- [ ] Post creation works
- [ ] Image upload works
- [ ] Real-time messaging works
- [ ] Notifications work

## Optimization

- [ ] Vercel Analytics enabled
- [ ] Render metrics checked
- [ ] Database indexes verified
- [ ] Redis caching configured
- [ ] HTTPS working (should be automatic)

## Monitoring & Maintenance

- [ ] Set up error tracking (Sentry optional)
- [ ] Enable uptime monitoring for Render (UptimeRobot optional)
- [ ] Review logs weekly
- [ ] Monitor database size
- [ ] Check API rate limits
- [ ] Update dependencies regularly

## Custom Domain (Optional)

- [ ] Domain name registered
- [ ] Vercel domain configuration complete
- [ ] Render API domain configuration complete
- [ ] DNS records updated
- [ ] SSL certificate issued (automatic)
- [ ] Test with custom domain

## Troubleshooting Completed

- [ ] All CORS issues resolved
- [ ] All environment variable issues resolved
- [ ] Database connection verified
- [ ] Redis connection verified
- [ ] Socket.io connection verified
- [ ] Email service tested

## Final Sign-Off

- [ ] All checklist items completed
- [ ] Tested by team member
- [ ] Ready for production
- [ ] Documentation updated
- [ ] Rollback plan documented

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Status:** ✅ Production Ready
