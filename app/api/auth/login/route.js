import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser } from "@/services/userService";
import { signToken, setAuthCookie } from "@/lib/jwt";
import { fail } from "@/utils/api";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(128)
});

export async function POST(request) {
  const limit = rateLimit(request, "login");
  if (limit.limited) return fail("Too many login attempts.", 429, { retryAfter: limit.retryAfter });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Invalid login payload.", 422, parsed.error.flatten());

  let user;
  try {
    user = await authenticateUser(parsed.data.email, parsed.data.password);
  } catch (error) {
    return fail(error.message || "Unable to login.", error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 400);
  }
  if (!user) return fail("Invalid email or password.", 401);

  const token = await signToken({ sub: user.id, role: user.role, email: user.email });
  const response = NextResponse.json({ ok: true, user });
  setAuthCookie(response, token);
  return response;
}
