import Redis from "ioredis";

/**
 * Redis connection configuration
 */

let redis: Redis | null = null;

export function createRedisConnection(connectionString: string): Redis {
  return new Redis(connectionString, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
}

export function getRedisConnection(): Redis {
  if (!redis) {
    const connectionString = process.env.REDIS_URL;
    if (!connectionString) {
      throw new Error("REDIS_URL environment variable is required");
    }
    redis = createRedisConnection(connectionString);
  }
  return redis;
}

export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}