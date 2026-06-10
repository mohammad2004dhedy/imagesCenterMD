import { NextResponse } from "next/server";
import { z } from "zod";
import { signToken, setAuthCookie } from "@/lib/jwt";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { upsertOAuthUser } from "@/services/userService";
import { fail } from "@/utils/api";

const schema = z.object({
  accessToken: z.string().min(1)
});

export async function POST(request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Invalid OAuth payload.", 422, parsed.error.flatten());

  const supabase = createSupabaseAdminClient();
  if (!supabase) return fail("Supabase Auth is not configured.", 503);

  const { data, error } = await supabase.auth.getUser(parsed.data.accessToken);
  if (error || !data.user?.email) return fail("Unable to verify Google account.", 401);

  try {
    const user = await upsertOAuthUser({
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email.split("@")[0]
    });
    const token = await signToken({ sub: user.id, role: user.role, email: user.email });
    const response = NextResponse.json({ ok: true, user });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return fail(error.message || "Unable to complete Google login.", error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 400);
  }
}
