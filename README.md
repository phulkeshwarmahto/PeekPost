# 📸 InstaClone — Instagram-Inspired Full-Stack Web App

> A feature-complete Instagram clone built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), supporting all core Instagram features plus an **InstaClone Premium** subscription to enjoy an ad-free experience.

---

## 🗂️ Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [InstaClone Premium](#instaclone-premium)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Getting Started](#getting-started)
8. [API Reference](#api-reference)
9. [Database Schema](#database-schema)
10. [Authentication & Security](#authentication--security)
11. [Media Handling](#media-handling)
12. [Real-Time Features](#real-time-features)
13. [Ad System](#ad-system)
14. [Deployment](#deployment)
15. [Contributing](#contributing)
16. [License](#license)

---

## Overview

**InstaClone** is a production-grade social media platform replicating the core Instagram experience — from photo/video sharing and stories to real-time messaging and explore feeds. Users who want a clean, distraction-free experience can subscribe to **InstaClone Premium** to remove all ads from their feed, stories, reels, and explore sections.

### Key Highlights

- Full authentication flow (JWT + OAuth via Google)
- Real-time DMs and notifications via Socket.IO
- Infinite scroll feeds with algorithm-based ranking
- Stories with 24-hour auto-expiry
- Reels (short-form video) with upload and playback
- InstaClone Premium for ad-free experience via Razorpay / Stripe
- Admin panel for ad campaign management

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | UI framework |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Socket.IO Client | Real-time communication |
| Axios | HTTP client |
| React Query | Server state & caching |
| Framer Motion | Animations |
| HLS.js | Video streaming (Reels) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB + Mongoose | Database & ODM |
| Socket.IO | WebSocket server |
| JWT | Authentication tokens |
| Bcrypt.js | Password hashing |
| Multer | File upload middleware |
| Cloudinary | Media storage & CDN |
| Redis | Session caching & pub/sub |
| Bull | Background job queue (notifications, emails) |

### Third-Party Services
| Service | Purpose |
|---|---|
| Cloudinary | Image & video hosting |
| Razorpay / Stripe | Premium subscription payments |
| Nodemailer + SendGrid | Email verification, OTP |
| Firebase (optional) | Push notifications |
| Google OAuth 2.0 | Social login |

---

## Features

### 👤 Authentication & Account
- [x] Register with email + username + password
- [x] Login / Logout
- [x] Google OAuth 2.0 sign-in
- [x] Email verification on signup
- [x] Forgot password via OTP email
- [x] Reset password
- [x] Account deactivation (soft delete)
- [x] Persistent sessions via JWT refresh tokens
- [x] Multiple device session management

### 🏠 Feed
- [x] Home feed showing posts from followed users
- [x] Algorithm-ranked feed (engagement + recency score)
- [x] Infinite scroll with pagination
- [x] Sponsored posts (ads) injected every 5 posts — removed for Premium users
- [x] Pull-to-refresh (mobile UX)

### 📷 Posts
- [x] Upload single or carousel (up to 10) images/videos
- [x] Apply filters (Clarendon, Gingham, Juno, Lark, etc.) via Canvas API
- [x] Write captions with hashtag and user mention parsing
- [x] Tag location (Google Maps Places API)
- [x] Tag people in photos
- [x] Like / Unlike posts
- [x] Double-tap to like animation
- [x] Save posts to collections
- [x] Share posts (copy link, share via DM)
- [x] Edit caption and tagged users after posting
- [x] Delete post (with media cleanup on Cloudinary)
- [x] Post view count
- [x] Hide like counts toggle (user preference)
- [x] Disable / enable comments per post

### 💬 Comments
- [x] Add, edit, delete comments
- [x] Nested replies (one level deep)
- [x] Like comments
- [x] Mention users in comments (@username)
- [x] Emoji keyboard support
- [x] Pinned comment by post author
- [x] Report comment

### 📖 Stories
- [x] Upload photo/video stories (max 60s video)
- [x] Stories expire after 24 hours (TTL index on MongoDB)
- [x] Story viewer list with seen/unseen status
- [x] Story reactions (emoji react)
- [x] Reply to story via DM
- [x] Story highlights (permanent story collections on profile)
- [x] Add text, stickers, music overlay to stories (canvas-based)
- [x] Story progress bar animation
- [x] Close friends story (restricted audience)
- [x] Story ads every 3–4 stories — removed for Premium users

### 🎬 Reels
- [x] Upload short-form vertical videos (up to 90s)
- [x] Auto-play on scroll (Intersection Observer API)
- [x] Like, comment, share, save reels
- [x] Reel audio — original or selected audio track
- [x] Trending audio / sounds
- [x] Reel explore / discover tab
- [x] Reel ads between scrolls — removed for Premium users

### 🔍 Explore
- [x] Grid-based explore feed (trending + personalized)
- [x] Search users, hashtags, places, audio
- [x] Hashtag pages with post counts and top posts
- [x] Location pages
- [x] Trending hashtags sidebar
- [x] Explore ads in the grid — removed for Premium users

### 👥 Social Graph
- [x] Follow / Unfollow users
- [x] Follow requests for private accounts
- [x] Accept / Decline follow requests
- [x] Followers and Following lists with search
- [x] Mutual followers ("Followed by X, Y, and 3 others")
- [x] Suggested users (based on mutual connections + interest)
- [x] Block / Unblock users
- [x] Restrict users (comments hidden pending approval)
- [x] Remove follower (without blocking)
- [x] "People You Might Know" section

### 👤 Profile
- [x] Profile photo upload and crop
- [x] Bio with links and line breaks
- [x] External link in bio
- [x] Public / Private account toggle
- [x] Posts grid (square previews)
- [x] Reels tab on profile
- [x] Tagged posts tab
- [x] Saved posts tab (visible only to self)
- [x] Story highlights on profile
- [x] Post, Follower, Following count
- [x] Category label (Creator, Business, Personal)

### 💌 Direct Messages (DMs)
- [x] One-on-one DMs
- [x] Group conversations (up to 32 people)
- [x] Send text, emojis, images, videos, reels, posts
- [x] Voice messages
- [x] Message reactions (emoji react)
- [x] Seen / delivered receipts
- [x] Typing indicators (Socket.IO)
- [x] Disappearing messages toggle (24h / 7d)
- [x] Message reply (thread)
- [x] Forward message
- [x] Delete message (for me / for everyone)
- [x] Message request inbox (non-follower DMs)
- [x] Online / Last seen status

### 🔔 Notifications
- [x] Real-time notifications via Socket.IO
- [x] Notification types: like, comment, follow, follow request, mention, tag, story react, DM
- [x] Mark all as read
- [x] Notification preferences (per-type toggle)
- [x] Push notifications (Firebase FCM — optional)
- [x] Email digest for activity (Bull job queue)

### 🔐 Privacy & Safety
- [x] Private account mode
- [x] Block users
- [x] Restrict users
- [x] Close friends list
- [x] Hide story from specific users
- [x] Two-factor authentication (TOTP via Google Authenticator)
- [x] Login activity log (device, IP, timestamp)
- [x] Report posts, comments, users, reels
- [x] Content sensitivity filter
- [x] Data download (export your data as ZIP)

### ⚙️ Settings
- [x] Edit profile
- [x] Change username / email / password
- [x] Linked accounts (Google)
- [x] Notification preferences
- [x] Privacy settings
- [x] Blocked accounts list
- [x] Restricted accounts list
- [x] Language preference
- [x] Dark mode / Light mode
- [x] Manage InstaClone Premium subscription
- [x] Delete account

---

## InstaClone Premium

Users can subscribe to **InstaClone Premium** to get a completely ad-free experience across the entire platform.

### What Premium Removes
| Surface | Free Tier | Premium |
|---|---|---|
| Feed sponsored posts | Every 5th post | None |
| Story ads | Every 3–4 stories | None |
| Reel ads | Between scrolls | None |
| Explore ads | In grid | None |

### Premium Pricing (example)
| Plan | Price | Billing |
|---|---|---|
| Monthly | ₹89 / $1.99 | Monthly auto-renewal |
| Yearly | ₹699 / $14.99 | Billed annually (save ~35%) |

### How It Works

1. User navigates to **Settings → InstaClone Premium**
2. Selects a plan (Monthly / Yearly)
3. Completes payment via **Razorpay** (India) or **Stripe** (International)
4. On successful payment webhook, `isPremium: true` and `premiumExpiry: Date` are set on the User document
5. A `premiumBadge` field toggles the gold checkmark on their profile (optional cosmetic)
6. Backend middleware checks `isPremium` on every feed / story / reel / explore request and strips ad-injection logic for premium users
7. A Bull job runs daily to check and expire premium subscriptions past their `premiumExpiry` date
8. Users can cancel anytime — premium remains active until the current period ends

### Premium Implementation Flow

```
User Clicks Subscribe
        │
        ▼
POST /api/premium/create-order
(Razorpay order or Stripe PaymentIntent created)
        │
        ▼
Client renders payment modal
(Razorpay Checkout SDK / Stripe Elements)
        │
        ▼
User completes payment
        │
        ▼
Webhook received at POST /api/premium/webhook
(Razorpay signature verified / Stripe event verified)
        │
        ▼
User.isPremium = true
User.premiumExpiry = now + plan duration
User.premiumPlan = "monthly" | "yearly"
        │
        ▼
All feed APIs check req.user.isPremium
→ true  → skip ad injection
→ false → inject ad every N posts/stories/reels
```

---

## Project Structure

```
instaclone/
├── client/                          # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/                  # Images, icons, fonts
│   │   ├── components/
│   │   │   ├── common/              # Button, Modal, Avatar, Loader, etc.
│   │   │   ├── feed/                # FeedPost, FeedAd, FeedSkeleton
│   │   │   ├── story/               # StoryRing, StoryViewer, StoryCreator
│   │   │   ├── reels/               # ReelCard, ReelPlayer, ReelUpload
│   │   │   ├── explore/             # ExploreGrid, ExploreSearch
│   │   │   ├── profile/             # ProfileHeader, PostGrid, Highlights
│   │   │   ├── messages/            # ChatList, ChatWindow, MessageBubble
│   │   │   ├── notifications/       # NotificationItem, NotificationPanel
│   │   │   └── premium/             # PremiumModal, PlanCard, PremiumBadge
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Reels.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Premium.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── feedSlice.js
│   │   │       ├── storySlice.js
│   │   │       ├── reelsSlice.js
│   │   │       ├── messageSlice.js
│   │   │       ├── notificationSlice.js
│   │   │       └── premiumSlice.js
│   │   ├── hooks/                   # useInfiniteScroll, useSocket, useMediaUpload
│   │   ├── services/                # axios instance, api calls
│   │   ├── utils/                   # formatTime, filterImage, truncate, etc.
│   │   ├── socket/                  # socket.js (Socket.IO client setup)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   ├── redis.js                 # Redis connection
│   │   └── razorpay.js              # Razorpay / Stripe init
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   ├── story.controller.js
│   │   ├── reel.controller.js
│   │   ├── comment.controller.js
│   │   ├── message.controller.js
│   │   ├── notification.controller.js
│   │   ├── explore.controller.js
│   │   ├── premium.controller.js
│   │   └── admin.controller.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Post.model.js
│   │   ├── Story.model.js
│   │   ├── Reel.model.js
│   │   ├── Comment.model.js
│   │   ├── Message.model.js
│   │   ├── Conversation.model.js
│   │   ├── Notification.model.js
│   │   ├── Ad.model.js
│   │   └── PremiumTransaction.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   ├── story.routes.js
│   │   ├── reel.routes.js
│   │   ├── comment.routes.js
│   │   ├── message.routes.js
│   │   ├── notification.routes.js
│   │   ├── explore.routes.js
│   │   ├── premium.routes.js
│   │   └── admin.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js       # verifyToken, optionalAuth
│   │   ├── premium.middleware.js    # checkPremium, injectAds
│   │   ├── upload.middleware.js     # multer config
│   │   ├── rateLimit.middleware.js  # express-rate-limit
│   │   └── error.middleware.js      # global error handler
│   ├── socket/
│   │   └── socket.js               # Socket.IO event handlers
│   ├── jobs/
│   │   ├── expireStories.job.js     # Bull job — delete 24h stories
│   │   ├── expirePremium.job.js     # Bull job — expire subscriptions
│   │   └── sendEmailDigest.job.js   # Bull job — daily email activity
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── sendEmail.js
│   │   ├── uploadToCloudinary.js
│   │   ├── feedAlgorithm.js
│   │   └── adInjector.js
│   ├── .env
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── docker-compose.yml               # Optional: containerized dev setup
└── README.md
```

---

## Environment Variables

### Server (`server/.env`)

```env
# App
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/instaclone

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis
REDIS_URL=redis://localhost:6379

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# SendGrid / Nodemailer
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
EMAIL_FROM=no-reply@instaclone.com

# Razorpay (India)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Stripe (International)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Premium Plans (price in paise for Razorpay, cents for Stripe)
PREMIUM_MONTHLY_PRICE_INR=8900
PREMIUM_YEARLY_PRICE_INR=69900
PREMIUM_MONTHLY_PRICE_USD=199
PREMIUM_YEARLY_PRICE_USD=1499
```

### Client (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x or yarn
- MongoDB Atlas account or local MongoDB instance
- Redis (local or Redis Cloud)
- Cloudinary account
- Razorpay or Stripe account (for premium)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/instaclone.git
cd instaclone
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Set Up Environment Variables

Copy the example env files and fill in your credentials:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 4. Seed the Database (Optional)

```bash
cd server
npm run seed
```

This seeds the database with:
- 20 dummy users with profile photos
- 100 sample posts
- 10 story groups
- 5 active ad campaigns

### 5. Run the Application

**Development mode (both client and server):**

```bash
# From root directory (if concurrently is set up)
npm run dev

# Or run separately:

# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

**Production build:**

```bash
# Build frontend
cd client && npm run build

# Start backend (serves frontend static build)
cd server && npm start
```

The app will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Socket.IO: `http://localhost:5000`

---

## API Reference

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/logout` | Logout user | ✅ |
| POST | `/refresh-token` | Refresh JWT | ❌ |
| POST | `/google` | Google OAuth login | ❌ |
| POST | `/forgot-password` | Send OTP to email | ❌ |
| POST | `/reset-password` | Reset password with OTP | ❌ |
| POST | `/verify-email` | Verify email with token | ❌ |

### User Routes — `/api/users`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/:username` | Get user profile | ✅ |
| PUT | `/me` | Update own profile | ✅ |
| POST | `/:id/follow` | Follow / Unfollow user | ✅ |
| GET | `/:id/followers` | Get followers list | ✅ |
| GET | `/:id/following` | Get following list | ✅ |
| POST | `/:id/block` | Block / Unblock user | ✅ |
| POST | `/:id/restrict` | Restrict / Unrestrict user | ✅ |
| GET | `/suggestions` | Get suggested users | ✅ |
| GET | `/search?q=` | Search users | ✅ |
| DELETE | `/me` | Delete account | ✅ |

### Post Routes — `/api/posts`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Create new post | ✅ |
| GET | `/feed` | Get home feed (with/without ads) | ✅ |
| GET | `/:id` | Get single post | ✅ |
| PUT | `/:id` | Edit post caption/tags | ✅ |
| DELETE | `/:id` | Delete post | ✅ |
| POST | `/:id/like` | Like / Unlike post | ✅ |
| POST | `/:id/save` | Save / Unsave post | ✅ |
| GET | `/:id/likes` | Get post likers | ✅ |
| GET | `/user/:userId` | Get user's posts | ✅ |

### Story Routes — `/api/stories`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Upload new story | ✅ |
| GET | `/feed` | Get stories feed | ✅ |
| GET | `/:userId` | Get user's active stories | ✅ |
| POST | `/:id/view` | Mark story as viewed | ✅ |
| POST | `/:id/react` | React to story | ✅ |
| DELETE | `/:id` | Delete story | ✅ |

### Reel Routes — `/api/reels`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Upload new reel | ✅ |
| GET | `/feed` | Get reels feed (with/without ads) | ✅ |
| GET | `/:id` | Get single reel | ✅ |
| POST | `/:id/like` | Like / Unlike reel | ✅ |
| DELETE | `/:id` | Delete reel | ✅ |

### Comment Routes — `/api/comments`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/post/:postId` | Add comment to post | ✅ |
| GET | `/post/:postId` | Get comments for post | ✅ |
| PUT | `/:id` | Edit comment | ✅ |
| DELETE | `/:id` | Delete comment | ✅ |
| POST | `/:id/like` | Like / Unlike comment | ✅ |
| POST | `/:id/reply` | Reply to comment | ✅ |
| POST | `/:id/pin` | Pin comment (author only) | ✅ |

### Message Routes — `/api/messages`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/conversations` | Get all conversations | ✅ |
| POST | `/conversations` | Create new conversation | ✅ |
| GET | `/conversations/:id` | Get messages in conversation | ✅ |
| POST | `/conversations/:id` | Send message | ✅ |
| DELETE | `/messages/:id` | Delete message | ✅ |

### Premium Routes — `/api/premium`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/plans` | Get available plans | ❌ |
| POST | `/create-order` | Create payment order | ✅ |
| POST | `/webhook` | Handle payment webhook | ❌ |
| GET | `/status` | Get user's premium status | ✅ |
| POST | `/cancel` | Cancel subscription | ✅ |

### Explore Routes — `/api/explore`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get explore feed (with/without ads) | ✅ |
| GET | `/trending` | Get trending hashtags | ✅ |
| GET | `/hashtag/:tag` | Get posts by hashtag | ✅ |
| GET | `/location/:id` | Get posts by location | ✅ |
| GET | `/search?q=` | Search everything | ✅ |

---

## Database Schema

### User Model

```js
{
  username: { type: String, unique: true, required: true },
  email:    { type: String, unique: true, required: true },
  password: { type: String },                          // null for OAuth users
  fullName: String,
  bio:      String,
  website:  String,
  avatar:   String,                                    // Cloudinary URL
  isPrivate: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },       // email verified
  followers:  [{ type: ObjectId, ref: 'User' }],
  following:  [{ type: ObjectId, ref: 'User' }],
  blockedUsers: [{ type: ObjectId, ref: 'User' }],
  restrictedUsers: [{ type: ObjectId, ref: 'User' }],
  closeFriends: [{ type: ObjectId, ref: 'User' }],
  savedPosts: [{ type: ObjectId, ref: 'Post' }],
  followRequests: [{ type: ObjectId, ref: 'User' }],
  // Premium
  isPremium:     { type: Boolean, default: false },
  premiumPlan:   { type: String, enum: ['monthly', 'yearly'], default: null },
  premiumExpiry: Date,
  premiumBadge:  { type: Boolean, default: false },
  // Auth
  googleId:      String,
  refreshToken:  String,
  twoFASecret:   String,
  twoFAEnabled:  { type: Boolean, default: false },
  // Settings
  hidelikeCounts: { type: Boolean, default: false },
  notifications: { likes: Boolean, comments: Boolean, follows: Boolean, ... },
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model

```js
{
  author:   { type: ObjectId, ref: 'User', required: true },
  media:    [{ url: String, type: { type: String, enum: ['image','video'] }, publicId: String }],
  caption:  String,
  hashtags: [String],
  mentions: [{ type: ObjectId, ref: 'User' }],
  tagged:   [{ user: ObjectId, x: Number, y: Number }],
  location: { name: String, lat: Number, lng: Number },
  likes:    [{ type: ObjectId, ref: 'User' }],
  comments: [{ type: ObjectId, ref: 'Comment' }],
  views:    { type: Number, default: 0 },
  commentsDisabled: { type: Boolean, default: false },
  createdAt: Date
}
```

### Story Model

```js
{
  author:   { type: ObjectId, ref: 'User', required: true },
  media:    { url: String, type: { type: String, enum: ['image','video'] }, publicId: String },
  text:     String,
  stickers: Array,
  music:    { title: String, artist: String, url: String },
  viewers:  [{ user: ObjectId, viewedAt: Date }],
  reactions:[{ user: ObjectId, emoji: String }],
  audience: { type: String, enum: ['public', 'closeFriends'], default: 'public' },
  expiresAt:{ type: Date, index: { expires: 0 } },    // TTL index
  createdAt: Date
}
```

### PremiumTransaction Model

```js
{
  user:          { type: ObjectId, ref: 'User', required: true },
  orderId:       String,                               // Razorpay / Stripe order ID
  paymentId:     String,                               // Razorpay / Stripe payment ID
  plan:          { type: String, enum: ['monthly', 'yearly'] },
  amount:        Number,
  currency:      String,
  status:        { type: String, enum: ['pending','success','failed','refunded'] },
  gateway:       { type: String, enum: ['razorpay', 'stripe'] },
  createdAt:     Date
}
```

---

## Authentication & Security

- **JWT Access Tokens** (15 min expiry) + **Refresh Tokens** (7 days, rotated on use)
- Passwords hashed with **bcrypt** (salt rounds: 12)
- **Google OAuth 2.0** via Passport.js
- **Two-Factor Authentication** via TOTP (Google Authenticator compatible)
- **Rate limiting** on auth routes (express-rate-limit): max 10 login attempts / 15 min per IP
- **Helmet.js** for HTTP security headers
- **CORS** whitelist for frontend origin
- **Razorpay / Stripe webhook signature verification** before processing any payment event
- All media URLs served via **Cloudinary CDN** (no direct access to storage)

---

## Media Handling

- Images and videos uploaded via **Multer** (in-memory buffer, max 50MB)
- Immediately transferred to **Cloudinary** using upload streams
- Images auto-compressed and served in **WebP** format via Cloudinary transformations
- Videos transcoded to **HLS** format for adaptive streaming (Reels / Story videos)
- On post/story/reel delete → Cloudinary `destroy()` called to remove media assets
- Story media tagged with a folder and TTL tracked in DB for cleanup

---

## Real-Time Features

All real-time functionality is handled via **Socket.IO** with Redis adapter for horizontal scaling.

### Socket Events

| Event | Direction | Description |
|---|---|---|
| `message:new` | Server → Client | New DM received |
| `message:seen` | Client → Server | Mark messages as seen |
| `typing:start` | Client → Server | User started typing |
| `typing:stop` | Client → Server | User stopped typing |
| `notification:new` | Server → Client | Push new notification |
| `story:new` | Server → Client | Notify followers of new story |
| `user:online` | Client → Server | User came online |
| `user:offline` | Client → Server | User went offline |
| `post:liked` | Server → Client | Real-time like count update |

---

## Ad System

Ads are managed by the **Admin Panel** and stored in the `Ad` collection.

### Ad Injection Logic (server-side)

```js
// middlewares/premium.middleware.js

export const injectAds = async (req, res, next) => {
  if (req.user?.isPremium) {
    req.showAds = false;
  } else {
    req.showAds = true;
  }
  next();
};

// utils/adInjector.js

export const injectAdsInFeed = (posts, ads, frequency = 5) => {
  if (!ads.length) return posts;
  const result = [...posts];
  let adIndex = 0;
  for (let i = frequency; i < result.length; i += frequency + 1) {
    result.splice(i, 0, { ...ads[adIndex % ads.length], isAd: true });
    adIndex++;
  }
  return result;
};
```

### Ad Model

```js
{
  title:       String,
  imageUrl:    String,
  linkUrl:     String,
  advertiser:  String,
  targetAudience: { ageMin: Number, ageMax: Number, interests: [String] },
  placement:   { type: String, enum: ['feed', 'story', 'reel', 'explore'] },
  impressions: { type: Number, default: 0 },
  clicks:      { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
  startDate:   Date,
  endDate:     Date
}
```

---

## Deployment

### Frontend — Vercel

```bash
cd client
npm run build
vercel deploy --prod
```

Set environment variables in Vercel dashboard.

### Backend — Render / Railway / AWS EC2

```bash
# On your server
git pull origin main
cd server
npm install --production
npm start
```

Or use the provided `Dockerfile`:

```bash
docker build -t instaclone-server ./server
docker run -p 5000:5000 --env-file server/.env instaclone-server
```

### Docker Compose (Full Stack Dev)

```bash
docker-compose up --build
```

This spins up MongoDB, Redis, the Node.js server, and the React client together.

### Environment Checklist Before Deploy

- [ ] `NODE_ENV=production` set
- [ ] All secrets rotated from dev values
- [ ] Cloudinary upload preset set to `signed`
- [ ] Razorpay / Stripe webhook URL updated to production endpoint
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Redis password set and TLS enabled
- [ ] CORS updated to production frontend domain
- [ ] Rate limiting tuned for production traffic

---

## Contributing

Contributions are welcome. Please follow this workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request with a clear description

### Commit Convention (Conventional Commits)

```
feat:     New feature
fix:      Bug fix
docs:     Documentation update
style:    Formatting, no logic change
refactor: Code restructure, no feature change
test:     Adding tests
chore:    Build process, dependency updates
```

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

> Built with ❤️ using the MERN Stack. Not affiliated with Meta or Instagram.
