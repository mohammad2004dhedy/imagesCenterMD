export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "dev-only-secret-change-me",
  databaseUrl: process.env.DATABASE_URL || "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY || "",
  pixabayApiKey: process.env.PIXABAY_API_KEY || "",
  pexelsApiKey: process.env.PEXELS_API_KEY || "",
  redisUrl: process.env.REDIS_URL || "",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 60)
};

export function hasDatabase() {
  return Boolean(env.databaseUrl);
}
