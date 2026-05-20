# MDImages Cloud / ImagesCenter SaaS

This is a full-stack migration of the original vanilla HTML/CSS/JS ImagesCenter project into a production-style Next.js App Router SaaS platform.

The old visual identity is preserved through the responsive gallery, floating controls, image cards, and showcase photography, but the palette has been upgraded into a premium white/blue SaaS system. The risky parts were moved server-side: API keys, provider calls, caching, analytics, and authentication.

## Stack

- Next.js App Router, JavaScript only
- Tailwind CSS
- REST API routes inside Next.js
- JWT authentication with HTTP-only cookies
- Prisma ORM with Supabase PostgreSQL schema
- Supabase client configuration
- Redis cache when `REDIS_URL` exists, in-memory cache otherwise
- Unsplash, Pexels, and Pixabay service brokerage
- Role-based admin dashboard
- SweetAlert2 modals and toast notifications

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Fill the required values in `.env.local`:

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
UNSPLASH_ACCESS_KEY=
PIXABAY_API_KEY=
PEXELS_API_KEY=
REDIS_URL=
```

4. Start the app:

```bash
npm run dev
```

The application uses Prisma with Supabase PostgreSQL for authentication, history, favorites, analytics, and reports. Add the database connection string before using authenticated features.

## Database

The Prisma schema is in `prisma/schema.prisma` and defines:

- `users`
- `search_history`
- `favorite_images`
- `cached_searches`
- `analytics`
- `reports`

When Supabase credentials are ready:

```bash
npm run prisma:generate
npm run prisma:push
```

Use the Supabase Session Pooler connection string for `DATABASE_URL`. The recommended shape is:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
```

Use a direct Supabase database connection for `DIRECT_URL` when running migrations or `prisma db push`. If you only have Session Pooler access, leave `DIRECT_URL` empty and use `DATABASE_URL` for runtime queries.

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/search`
- `GET /api/history`
- `DELETE /api/history`
- `DELETE /api/history/:id`
- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:id`
- `GET /api/admin/stats`

## Cloud Computing Concepts

- SaaS: authenticated browser product for image search and favorites
- PaaS: prepared for Vercel and Supabase managed services
- IaaS: optional Redis and external provider infrastructure
- Cloud Service Brokerage: unified search service aggregates Unsplash, Pexels, and Pixabay
- Resource Pooling: shared API route/service/cache/database layers
- Rapid Elasticity: serverless Next.js route handlers and optional Redis cache
- Measured Service: analytics events, API usage, cache stats, popular keywords
- Broad Network Access: web UI and REST APIs over standard HTTP
- High Availability: cache fallback and resilient provider error handling
- Scalability: clean separation of UI, services, data access, auth, and middleware

## Deployment

### Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add `.env.local` values as Vercel Environment Variables.
4. Set build command to:

```bash
npm run build
```

### Supabase

1. Create a Supabase project.
2. Copy the PostgreSQL connection strings into `DATABASE_URL` and `DIRECT_URL`.
3. Run `npm run prisma:push` locally or in a migration job.

### Render Optional Services

Use Render for optional Redis-compatible services or additional workers. The Next.js API routes already work without a separate backend service.

## Security Notes

- External API keys are read only from server-side environment variables.
- JWT tokens are stored in HTTP-only cookies.
- Admin pages and APIs require `admin` role.
- Search and auth routes use in-memory rate limiting.
- Request payloads are validated with Zod.
- Blocked search terms are rejected before provider calls.

## Required Environment Variables

Fill these in `.env.local` before production deployment:

- `NEXT_PUBLIC_APP_URL`: public app URL, for example `https://your-app.vercel.app`.
- `JWT_SECRET`: long random secret used to sign HTTP-only JWT session cookies.
- `DATABASE_URL`: Supabase Session Pooler PostgreSQL URL used by Prisma at runtime.
- `DIRECT_URL`: direct Supabase PostgreSQL URL for Prisma migrations/db push when available.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL for Supabase client integrations.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key for public client-side Supabase features.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only Supabase service key for privileged admin/service workflows.
- `UNSPLASH_ACCESS_KEY`: server-side Unsplash API key.
- `PIXABAY_API_KEY`: server-side Pixabay API key.
- `PEXELS_API_KEY`: server-side Pexels API key.
- `REDIS_URL`: optional Redis-compatible URL; if empty, memory cache is used.
- `RATE_LIMIT_WINDOW_MS`: optional rate-limit window in milliseconds.
- `RATE_LIMIT_MAX_REQUESTS`: optional max requests per rate-limit window.

The app is defensive when values are missing: database-backed features return clear setup errors, image providers return empty results until their keys are added, and Redis falls back to memory caching.
