import Redis from "ioredis";

let redisClient = null;

export const getRedisClient = () => {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
    });

    redisClient.on("error", (error) => {
      console.warn("Redis unavailable:", error.message);
    });

    redisClient.connect().catch(() => {
      console.warn("Skipping Redis connection for local development");
    });
  }

  return redisClient;
};