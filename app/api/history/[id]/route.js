import { getSession } from "@/lib/jwt";
import { deleteSearchHistory } from "@/services/searchHistoryService";
import { fail, ok } from "@/utils/api";

export async function DELETE(_request, { params }) {
  const session = await getSession();
  if (!session?.sub) return fail("Authentication required.", 401);
  try {
    await deleteSearchHistory(session.sub, params.id);
    return ok({});
  } catch (error) {
    return fail(error.message || "Unable to delete history item.", error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 500);
  }
}
