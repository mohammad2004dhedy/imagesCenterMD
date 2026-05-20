import { getSession } from "@/lib/jwt";
import { deleteFavorite } from "@/services/favoriteService";
import { fail, ok } from "@/utils/api";

export async function DELETE(_request, { params }) {
  const session = await getSession();
  if (!session?.sub) return fail("Authentication required.", 401);
  try {
    await deleteFavorite(session.sub, params.id);
    return ok({});
  } catch (error) {
    return fail(error.message || "Unable to delete favorite.", error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 500);
  }
}
