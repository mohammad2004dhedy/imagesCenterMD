import { getSession } from "@/lib/jwt";
import { clearSearchHistory, getSearchHistory } from "@/services/searchHistoryService";
import { fail, ok } from "@/utils/api";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) return fail("Authentication required.", 401);
  try {
    const history = await getSearchHistory(session.sub);
    return ok({ history });
  } catch (error) {
    return fail(error.message || "Unable to load history.", error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 500);
  }
}

export async function DELETE() {
  const session = await getSession();
  if (!session?.sub) return fail("Authentication required.", 401);
  try {
    await clearSearchHistory(session.sub);
    return ok({});
  } catch (error) {
    return fail(error.message || "Unable to clear history.", error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 500);
  }
}
