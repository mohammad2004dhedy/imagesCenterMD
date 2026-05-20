import { z } from "zod";
import { getSession } from "@/lib/jwt";
import { addFavorite, getFavorites } from "@/services/favoriteService";
import { fail, ok } from "@/utils/api";

const schema = z.object({
  provider: z.string().min(2),
  externalId: z.string().min(1),
  title: z.string().optional(),
  imageUrl: z.string().min(1),
  thumbUrl: z.string().optional(),
  pageUrl: z.string().optional(),
  author: z.string().optional(),
  metadata: z.any().optional()
});

export async function GET() {
  const session = await getSession();
  if (!session?.sub) return fail("Authentication required.", 401);
  try {
    const favorites = await getFavorites(session.sub);
    return ok({ favorites });
  } catch (error) {
    return fail(error.message || "Unable to load favorites.", error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 500);
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session?.sub) return fail("Authentication required.", 401);
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Invalid favorite payload.", 422, parsed.error.flatten());
  try {
    const result = await addFavorite({ ...parsed.data, userId: session.sub });
    return ok(result);
  } catch (error) {
    return fail(error.message || "Unable to save favorite.", error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 500);
  }
}
