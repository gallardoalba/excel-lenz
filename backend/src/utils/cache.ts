import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

let redis: Redis | null = null;

/** Get Redis client (lazy init, returns null if not configured) */
export function getRedis(): Redis | null {
  if (redis) return redis;
  if (!REDIS_URL) return null;

  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null; // Stop retrying
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redis.on('error', (err) => {
      console.warn('[Redis] connection error:', err.message);
    });

    return redis;
  } catch {
    return null;
  }
}

/** Cache helper — falls back to in-memory Map if Redis unavailable */
const memoryCache = new Map<string, { data: unknown; expires: number }>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  const r = getRedis();
  if (r) {
    try {
      const val = await r.get(key);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  }

  // In-memory fallback
  const entry = memoryCache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data as T;
  memoryCache.delete(key);
  return null;
}

export async function cacheSet(key: string, data: unknown, ttlSeconds: number = 300): Promise<void> {
  const r = getRedis();
  if (r) {
    try {
      await r.setex(key, ttlSeconds, JSON.stringify(data));
      return;
    } catch { /* fall through to memory */ }
  }

  memoryCache.set(key, { data, expires: Date.now() + ttlSeconds * 1000 });
}

export async function cacheDel(key: string): Promise<void> {
  const r = getRedis();
  if (r) {
    try { await r.del(key); } catch { /* ignore */ }
  }
  memoryCache.delete(key);
}
