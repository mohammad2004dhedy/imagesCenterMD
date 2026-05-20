import { z } from "zod";
import { getSession } from "@/lib/jwt";
import { rateLimit } from "@/lib/rate-limit";
import { searchImages } from "@/services/searchService";
import { fail, ok } from "@/utils/api";

const schema = z.object({
  query: z.string().min(2).max(100),
  category: z.string().default("all"),
  count: z.coerce.number().min(1).max(30).default(12)
});

export async function GET(request) {
  const limit = rateLimit(request, "search");
  if (limit.limited) return fail("Rate limit exceeded.", 429, { retryAfter: limit.retryAfter });

  const url = new URL(request.url);
  const parsed = schema.safeParse({
    query: url.searchParams.get("query"),
    category: url.searchParams.get("category") || "all",
    count: url.searchParams.get("count") || 12
  });
  if (!parsed.success) return fail("Invalid search request.", 422, parsed.error.flatten());

  const session = await getSession();
  if (!session?.sub) return fail("Authentication required.", 401);
  try {
    const data = await searchImages({ ...parsed.data, userId: session?.sub });
    return ok(data);
  } catch (error) {
    return fail(
      error.message || "Search failed.",
      error.code === "CONTENT_BLOCKED" ? 422 : error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 500
    );
  }
}
