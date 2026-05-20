import { getSession } from "@/lib/jwt";
import { getUserById } from "@/services/userService";
import { ok } from "@/utils/api";

export async function GET() {
  const session = await getSession();
  let user = null;
  try {
    user = session?.sub ? await getUserById(session.sub) : null;
  } catch {
    user = null;
  }
  return ok({ user });
}
