import Redis from "ioredis";
import { env } from "@/lib/env";

const memory = new Map();
let redis;

function getRedis() {
  if (!env.redisUrl) return null;
  if (!redis) {
    redis = new Redis(env.redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
  }
  return redis;
}

export async function getCache(key) {
  const client = getRedis();
  if (client) {
    try {
      if (client.status === "wait") await client.connect();
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return getMemory(key);
    }
  }
  return getMemory(key);
}

export async function setCache(key, value, ttlSeconds = 900) {
  const client = getRedis();
  if (client) {
    try {
      if (client.status === "wait") await client.connect();
      await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
      return;
    } catch {
      setMemory(key, value, ttlSeconds);
      return;
    }
  }
  setMemory(key, value, ttlSeconds);
}

function getMemory(key) {
  const entry = memory.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memory.delete(key);
    return null;
  }
  entry.hitCount += 1;
  return entry.value;
}

function setMemory(key, value, ttlSeconds) {
  memory.set(key, {
    value,
    hitCount: 0,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}

export function cacheStats() {
  return {
    mode: env.redisUrl ? "redis-with-memory-fallback" : "memory",
    entries: memory.size
  };
}
