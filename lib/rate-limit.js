import { env } from "@/lib/env";

const buckets = new Map();

export function rateLimit(request, scope = "global") {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + env.rateLimitWindowMs });
    return { limited: false };
  }

  existing.count += 1;
  return {
    limited: existing.count > env.rateLimitMaxRequests,
    retryAfter: Math.ceil((existing.resetAt - now) / 1000)
  };
}
