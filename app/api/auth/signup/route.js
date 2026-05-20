import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/services/userService";
import { signToken, setAuthCookie } from "@/lib/jwt";
import { fail } from "@/utils/api";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  email: z.string().trim().email(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .max(128)
    .regex(/[A-Za-z]/, "Password must include a letter.")
    .regex(/[0-9]/, "Password must include a number.")
});

export async function POST(request) {
  const limit = rateLimit(request, "signup");
  if (limit.limited) return fail("Too many signup attempts.", 429, { retryAfter: limit.retryAfter });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Invalid signup payload.", 422, parsed.error.flatten());

  try {
    const user = await createUser(parsed.data);
    const token = await signToken({ sub: user.id, role: user.role, email: user.email });
    const response = NextResponse.json({ ok: true, user });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return fail(error.message || "Unable to create account.", error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 400);
  }
}
