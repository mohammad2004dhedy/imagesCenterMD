import { getSession } from "@/lib/jwt";
import { getAdminDashboard } from "@/services/analyticsService";
import { fail, ok } from "@/utils/api";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) return fail("Authentication required.", 401);
  if (session.role !== "admin") return fail("Admin role required.", 403);
  try {
    const stats = await getAdminDashboard();
    return ok({ stats });
  } catch (error) {
    return fail(error.message || "Unable to load admin dashboard.", error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 500);
  }
}
