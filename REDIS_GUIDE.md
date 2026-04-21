# Redis Setup & Usage Guide for PeekPost

Complete guide for setting up, configuring, and using Redis in the PeekPost application.

---

## Table of Contents

1. [Redis Overview](#redis-overview)
2. [Local Development Setup](#local-development-setup)
3. [Redis Cloud Setup (Production)](#redis-cloud-setup-production)
4. [Connection Configuration](#connection-configuration)
5. [Redis in PeekPost](#redis-in-peekpost)
6. [Common Patterns & Examples](#common-patterns--examples)
7. [Performance & Best Practices](#performance--best-practices)
8. [Monitoring & Debugging](#monitoring--debugging)
9. [Troubleshooting](#troubleshooting)

---

## Redis Overview

**What is Redis?**

Redis is an in-memory data store that functions as:
- **Cache layer** - Speed up database queries
- **Session store** - Store user sessions
- **Rate limiter** - Prevent API abuse
- **Job queue** - Process background tasks (Bull)
- **Real-time notifications** - Pub/Sub messaging

**Why Redis for PeekPost?**

- Improve API response times (cache expensive queries)
- Store active user sessions
- Real-time feed generation
- Socket.io session sharing across servers
- Message queue for notifications
- Rate limiting on API endpoints

**Data Types in Redis:**

| Type | Use Case |
|------|----------|
| `String` | Simple values, counters |
| `Hash` | User sessions, objects |
| `List` | Activity feeds, job queues |
| `Set` | Unique items, followers |
| `Sorted Set` | Leaderboards, timestamps |
| `Stream` | Event logs, messages |

---

## Local Development Setup

### Option 1: Using Docker (Recommended)

**Prerequisites:**
- Docker Desktop installed: https://www.docker.com/products/docker-desktop

**Start Redis locally:**

```bash
# Pull and run Redis image
docker run --name peekpost-redis -p 6379:6379 -d redis:latest

# Or with persistence (data saved to disk)
docker run --name peekpost-redis \
  -p 6379:6379 \
  -v redis-data:/data \
  -d redis:latest \
  redis-server --appendonly yes
```

**Verify Redis is running:**

```bash
docker ps | grep peekpost-redis
```

**Stop Redis:**

```bash
docker stop peekpost-redis
```

**Remove Redis container:**

```bash
docker rm peekpost-redis
```

### Option 2: Using Docker Compose (Best for Full Stack)

Add to your `docker-compose.yml`:

```yaml
version: '3.8'

services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    networks:
      - peekpost

  # Your other services...
  
volumes:
  redis-data:

networks:
  peekpost:
    driver: bridge
```

**Run entire stack:**

```bash
docker-compose up -d
```

### Option 3: Direct Installation

**Windows:**
- Download from: https://github.com/microsoftarchive/redis/releases
- Or use WSL: `wsl apt-get install redis-server`

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
```

---

## Redis Cloud Setup (Production)

### Step 1: Create Redis Cloud Account

1. Go to https://redis.com/cloud/
2. Sign up with Google or email
3. Click **Get Started Free**
4. Create a free database (30MB)

### Step 2: Configure Your Database

1. **Database Name:** `peekpost-redis`
2. **Region:** Select closest to your users
3. **Redis Version:** Latest stable
4. **Memory:** 30MB (free tier)
5. Click **Create**

### Step 3: Get Connection Details

1. Go to **Databases** → Your database
2. Click **Connect**
3. Copy the connection string (looks like):
   ```
   redis://:password@redis-18123.c123.us-east-1-2.ec2.cloud.redis.io:18123
   ```

### Step 4: Configure in Render

In your Render Web Service:

1. Go to **Environment**
2. Add:
   ```
   REDIS_URL=redis://:your_password@your_host:your_port
   ```
3. Redeploy service

### Redis Cloud Plans

| Plan | Memory | Cost | Use Case |
|------|--------|------|----------|
| Free | 30MB | $0 | Development |
| Starter | 1GB | $7/mo | Small production |
| Business | 10GB+ | $24+/mo | Medium+ production |

**For PeekPost production, upgrade to Starter ($7/mo) when traffic increases.**

---

## Connection Configuration

### Server Configuration

Your server already has Redis configured via [server/config/redis.js](server/config/redis.js):

**Current setup (check and update if needed):**

```javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || {
  host: 'localhost',
  port: 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.log('Redis error:', err));

export default redis;
```

### Environment Variables

**Development (.env):**
```
REDIS_URL=redis://localhost:6379
```

**Production (.env):**
```
REDIS_URL=redis://:your_password@redis-host:port
```

### Connection Options

**Standard Connection (localhost):**
```javascript
const redis = new Redis();
```

**Named Parameters:**
```javascript
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: undefined,
  db: 0,
});
```

**URL Connection String:**
```javascript
const redis = new Redis('redis://:password@host:port/db');
```

### Test Connection

```bash
# In your terminal
redis-cli

# Then test:
> PING
# Response: PONG

# Or via Node:
node -e "import Redis from 'ioredis'; const r = new Redis(); r.ping().then(console.log);"
```

---

## Redis in PeekPost

### Current Usage in Your Project

Check these files to see how Redis is currently used:

#### 1. **Background Jobs** - [server/jobs/index.js](server/jobs/index.js)

Uses Bull queue library (backed by Redis):
- Premium subscription expiration
- Story expiration
- Email digest delivery

```javascript
import Queue from 'bull';

const expirePremiumQueue = new Queue('expire-premium', {
  redis: { url: process.env.REDIS_URL }
});

expirePremiumQueue.process(async (job) => {
  // Process expired premiums
});
```

#### 2. **Rate Limiting** - [server/middlewares/rateLimit.middleware.js](server/middlewares/rateLimit.middleware.js)

Uses Redis to track request counts:

```javascript
const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate-limit:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});
```

#### 3. **Socket.io Sessions** - [server/socket/socket.js](server/socket/socket.js)

Shares sessions across multiple server instances:

```javascript
const io = new Server(server, {
  adapter: createAdapter(pubClient, subClient),
});
```

### Recommended Usage Patterns for PeekPost

#### 1. **Cache User Data**

```javascript
// Get user from cache or database
async function getUserWithCache(userId) {
  const cacheKey = `user:${userId}`;
  
  // Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Query database
  const user = await User.findById(userId);
  
  // Store in cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  
  return user;
}
```

#### 2. **Cache Feed Posts**

```javascript
// Cache user's feed
async function getCachedFeed(userId, page = 1) {
  const cacheKey = `feed:${userId}:${page}`;
  
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Generate feed if not cached
  const feed = await generateUserFeed(userId, page);
  
  // Cache for 10 minutes
  await redis.setex(cacheKey, 600, JSON.stringify(feed));
  
  return feed;
}
```

#### 3. **Invalidate Cache on Updates**

```javascript
// When user updates profile
async function updateUserProfile(userId, data) {
  await User.findByIdAndUpdate(userId, data);
  
  // Invalidate cache
  await redis.del(`user:${userId}`);
  await redis.del(`feed:${userId}:*`); // All feed pages
}
```

#### 4. **Real-time Notifications Counter**

```javascript
// Increment notification count
async function notifyUser(userId, notification) {
  const key = `notifications:${userId}`;
  
  // Save notification to database
  await Notification.create(notification);
  
  // Increment counter
  await redis.incr(`${key}:count`);
  
  // Emit real-time update
  io.to(userId).emit('notification', notification);
}

// Get notification count
async function getNotificationCount(userId) {
  return await redis.get(`notifications:${userId}:count`);
}
```

#### 5. **Rate Limiting per User**

```javascript
// Check if user exceeded action limit
async function checkRateLimit(userId, action, limit, windowSeconds) {
  const key = `rate:${action}:${userId}`;
  
  const count = await redis.incr(key);
  
  if (count === 1) {
    // First request in this window
    await redis.expire(key, windowSeconds);
  }
  
  return count <= limit;
}

// Usage in controller
const canPost = await checkRateLimit(userId, 'create_post', 5, 3600); // 5 posts per hour
if (!canPost) {
  return res.status(429).json({ error: 'Too many requests' });
}
```

#### 6. **User Online Status**

```javascript
// Mark user as online
async function setUserOnline(userId) {
  await redis.setex(`user:${userId}:online`, 300, '1'); // 5 min TTL
}

// Check if user online
async function isUserOnline(userId) {
  return await redis.exists(`user:${userId}:online`);
}

// Socket.io event handlers
socket.on('disconnect', async () => {
  await redis.del(`user:${userId}:online`);
  socket.broadcast.emit('user_offline', userId);
});
```

---

## Common Patterns & Examples

### Pattern 1: Cache-Aside (Lazy Loading)

```javascript
async function getPostWithCache(postId) {
  // Try cache
  const cache = await redis.get(`post:${postId}`);
  if (cache) return JSON.parse(cache);
  
  // Load from DB
  const post = await Post.findById(postId).populate('author comments');
  
  // Store in cache
  if (post) {
    await redis.setex(`post:${postId}`, 1800, JSON.stringify(post));
  }
  
  return post;
}
```

### Pattern 2: Cache Invalidation on Update

```javascript
async function updatePost(postId, updates) {
  const post = await Post.findByIdAndUpdate(postId, updates, { new: true });
  
  // Invalidate related caches
  await redis.del(`post:${postId}`);
  await redis.del(`feed:*`); // Invalidate all feeds
  
  return post;
}
```

### Pattern 3: Distributed Counter

```javascript
async function incrementPostLikes(postId) {
  const key = `post:${postId}:likes`;
  const newCount = await redis.incr(key);
  
  // Periodically sync to database
  if (newCount % 10 === 0) {
    await Post.findByIdAndUpdate(postId, { likes: newCount });
  }
  
  return newCount;
}
```

### Pattern 4: Leaderboard

```javascript
// Add user to leaderboard
async function addToLeaderboard(userId, score) {
  await redis.zadd('leaderboard', score, userId);
}

// Get top 10
async function getTopLeaderboard() {
  return await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');
}

// Get user rank
async function getUserRank(userId) {
  return await redis.zrevrank('leaderboard', userId);
}
```

### Pattern 5: Session Storage

```javascript
// Store session
async function storeSession(sessionId, userId) {
  await redis.setex(
    `session:${sessionId}`,
    86400, // 24 hours
    JSON.stringify({ userId, createdAt: Date.now() })
  );
}

// Retrieve session
async function getSession(sessionId) {
  const session = await redis.get(`session:${sessionId}`);
  return session ? JSON.parse(session) : null;
}
```

### Pattern 6: Pub/Sub for Real-time Updates

```javascript
// Publisher - emit event
async function publishUpdate(channel, data) {
  await redis.publish(channel, JSON.stringify(data));
}

// Subscriber - listen for events
const subscriber = redis.duplicate();

subscriber.subscribe('user_updates', (message) => {
  const data = JSON.parse(message);
  io.emit('update', data);
});
```

---

## Performance & Best Practices

### Best Practices

#### 1. **Use Appropriate TTLs (Time-To-Live)**

```javascript
// Short TTL for volatile data
await redis.setex('temp_data', 300, data); // 5 minutes

// Longer TTL for stable data
await redis.setex('user_profile', 3600, data); // 1 hour

// Very long TTL for rarely-changing data
await redis.setex('settings', 86400, data); // 24 hours
```

#### 2. **Batch Operations for Performance**

```javascript
// Inefficient - multiple requests
for (let i = 0; i < 1000; i++) {
  await redis.set(`key:${i}`, value);
}

// Efficient - single pipeline
const pipeline = redis.pipeline();
for (let i = 0; i < 1000; i++) {
  pipeline.set(`key:${i}`, value);
}
await pipeline.exec();
```

#### 3. **Use Appropriate Data Types**

```javascript
// ❌ Bad - storing object as string
await redis.set('user:1', JSON.stringify(user)); // 1 key per user

// ✅ Good - using hash
await redis.hset('user:1', user); // Better memory usage
```

#### 4. **Namespace Your Keys**

```javascript
// ✅ Good - clear hierarchical naming
`post:${postId}`
`user:${userId}:feed:page:${page}`
`cache:comments:${postId}`
`temp:otp:${email}`
`session:${sessionId}`

// ❌ Bad - unclear naming
`p1`
`u1f1`
`c1`
```

#### 5. **Handle Redis Failures Gracefully**

```javascript
async function getWithFallback(key) {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  } catch (error) {
    console.error('Redis error:', error);
    // Fall through to database
  }
  
  // Database fallback
  return await database.query(key);
}
```

#### 6. **Monitor Memory Usage**

```javascript
// Check Redis info
async function checkRedisMemory() {
  const info = await redis.info('memory');
  console.log(info);
  // Look for: used_memory, used_memory_peak, maxmemory
}

// Set max memory policy in Render/Cloud
// maxmemory-policy: allkeys-lru (evict least recently used)
```

### Performance Tips

| Tip | Benefit |
|-----|---------|
| Use pipelines for batch ops | 10-100x faster |
| Set appropriate TTLs | Prevents memory bloat |
| Use hashes for objects | 20-30% less memory |
| Enable RDB or AOF | Data persistence |
| Monitor memory usage | Prevent OOM errors |
| Use connection pooling | Better concurrency |
| Implement circuit breaker | Graceful degradation |

---

## Monitoring & Debugging

### View Redis Metrics in Render

1. Go to your Render Web Service dashboard
2. Click **Metrics** tab
3. Monitor:
   - Memory usage
   - Connected clients
   - Commands per second
   - Hit rate (if available)

### Using Redis CLI

**Connect to local Redis:**
```bash
redis-cli
```

**Connect to Redis Cloud:**
```bash
redis-cli -u redis://:password@host:port
```

**Useful commands:**

```bash
# General info
INFO              # Full server info
INFO memory       # Memory stats
INFO stats        # Statistics
INFO replication  # Replication info

# Key operations
KEYS *            # List all keys
DBSIZE            # Number of keys
SCAN 0            # Iterate keys (better than KEYS)
TTL key           # Get key expiration
EXPIRE key 3600   # Set expiration

# Memory
MEMORY USAGE key  # Memory used by key
FLUSHDB           # Delete all keys (⚠️ careful!)

# Performance
SLOWLOG GET 10    # Last 10 slow queries
CLIENT LIST       # Connected clients
CLIENT KILL 127.0.0.1:6379  # Kill connection

# Monitoring
MONITOR           # Real-time command stream
SUBSCRIBE channel # Subscribe to pub/sub

# Cache stats
DEBUG OBJECT key  # Debug object info
```

### Example: Check Redis Health

```bash
# Connect
redis-cli

# Check connection
PING
# Response: PONG

# Check memory
INFO memory
# Look for: used_memory_human, maxmemory_human

# Check keys
DBSIZE
# Returns number of keys

# Check slowest operations
SLOWLOG GET 5

# Exit
EXIT
```

### Monitoring Script (Node.js)

```javascript
import redis from './config/redis.js';

async function monitorRedis() {
  // Memory usage
  const info = await redis.info('memory');
  console.log('Memory:', info.match(/used_memory_human:([^\r\n]*)/)[1]);
  
  // Connected clients
  const clients = await redis.info('clients');
  console.log('Clients:', clients.match(/connected_clients:([^\r\n]*)/)[1]);
  
  // Keys count
  const size = await redis.dbsize();
  console.log('Keys:', size);
  
  // Slowest commands
  const slowlog = await redis.slowlog('get', 5);
  console.log('Slow commands:', slowlog);
}

monitorRedis();
```

---

## Troubleshooting

### Issue: "Connection Refused"

**Cause:** Redis not running

**Solution:**
```bash
# Check if Redis is running
docker ps | grep redis

# Start Redis
docker run -p 6379:6379 -d redis:latest

# Or via docker-compose
docker-compose up -d redis
```

### Issue: "Auth Error" or "NOAUTH Authentication required"

**Cause:** Missing password in connection string

**Solution:**
```javascript
// Include password in URL
const redis = new Redis('redis://:your_password@host:port');

// Or in environment
REDIS_URL=redis://:your_password@redis-host:port
```

### Issue: Timeout Errors

**Cause:** Redis overloaded or network issues

**Solution:**
```javascript
// Increase timeout in ioredis
const redis = new Redis({
  connectTimeout: 10000,
  retryStrategy: (times) => {
    return Math.min(times * 100, 3000);
  },
});
```

### Issue: Out of Memory (OOM)

**Cause:** Redis memory limit exceeded

**Solution:**

1. In Render/Cloud, upgrade plan:
   - Free: 30MB
   - Starter: 1GB
   - Business: 10GB+

2. Set memory policy:
   ```bash
   CONFIG SET maxmemory-policy allkeys-lru
   ```

3. Clear old data:
   ```bash
   FLUSHDB  # Dangerous - clears all data!
   ```

4. Optimize key storage:
   ```javascript
   // Use hashes instead of individual strings
   await redis.hset('user:1', 'name', 'John', 'email', 'john@...');
   // Instead of:
   // await redis.set('user:1:name', 'John');
   // await redis.set('user:1:email', 'john@...');
   ```

### Issue: Slow Queries

**Cause:** Large keys or inefficient commands

**Solution:**

```bash
# Check slowlog
SLOWLOG GET 10

# Fix: Use pipeline for batch operations
# Bad - 1000 separate commands
for (let i = 0; i < 1000; i++) await redis.get(`key:${i}`);

# Good - 1 pipeline
const pipeline = redis.pipeline();
for (let i = 0; i < 1000; i++) pipeline.get(`key:${i}`);
await pipeline.exec();
```

### Issue: Data Loss on Restart

**Cause:** No persistence enabled

**Solution:**

In Redis Cloud/Render dashboard:
- Enable **RDB** (snapshot) - Good balance
- Enable **AOF** (append-only file) - More durable but slower

Or in Docker:
```bash
docker run -d redis:latest redis-server --appendonly yes
```

### Issue: Keys Not Expiring

**Cause:** TTL not set or backend issue

**Solution:**

```bash
# Check TTL
TTL key_name
# -1 = no expiration, -2 = doesn't exist

# Set expiration
EXPIRE key 3600  # 1 hour

# In code
await redis.setex('key', 3600, value); // Always use setex
```

---

## Integration Checklist

- [ ] Redis running locally (`docker run redis:latest`)
- [ ] REDIS_URL in `.env` file
- [ ] Connection tested (`redis-cli ping`)
- [ ] Bull queues working for background jobs
- [ ] Rate limiting functional
- [ ] Socket.io using Redis adapter
- [ ] Cache implementation for posts/users
- [ ] Monitoring set up in Render
- [ ] Memory limits configured in Redis Cloud
- [ ] Appropriate TTLs set for all cached data
- [ ] Error handling for Redis failures
- [ ] Tested in production (Render)

---

## Quick Reference

### Connection Strings

```
Local:
redis://localhost:6379

Redis Cloud:
redis://:password@redis-18xxx.c123.us-east-1-2.ec2.cloud.redis.io:18xxx
```

### Common Commands

```javascript
// Strings
await redis.set(key, value);
await redis.get(key);
await redis.setex(key, ttl, value); // With expiration
await redis.incr(key); // Increment counter

// Hashes
await redis.hset(key, field, value);
await redis.hget(key, field);
await redis.hgetall(key);

// Lists
await redis.lpush(key, value); // Left push
await redis.rpush(key, value); // Right push
await redis.lpop(key); // Pop from left
await redis.lrange(key, 0, -1); // Get all

// Sets
await redis.sadd(key, member);
await redis.smembers(key);
await redis.scard(key); // Set size

// Sorted Sets
await redis.zadd(key, score, member);
await redis.zrange(key, 0, -1);
await redis.zrevrange(key, 0, -1); // Reversed

// Key operations
await redis.del(key);
await redis.exists(key);
await redis.expire(key, ttl);
await redis.ttl(key);
```

### Key Naming Convention

```
user:{userId}                  // User profile
user:{userId}:feed:page:{num}  // User feed
post:{postId}                  // Post data
post:{postId}:comments         // Post comments list
cache:{type}:{id}              // Generic cache
session:{sessionId}            // Session data
rate:{action}:{userId}         // Rate limiter
notifications:{userId}         // Notifications
online:{userId}                // Online status
```

---

## Resources

- **Redis Docs:** https://redis.io/documentation
- **iORedis Docs:** https://github.com/luin/ioredis
- **Redis Cloud Docs:** https://redis.com/try-free/
- **Render Redis Guide:** https://render.com/docs/redis

---

**Status:** ✅ Ready for implementation  
**Last Updated:** April 2026
