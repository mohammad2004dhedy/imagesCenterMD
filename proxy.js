import { NextResponse } from "next/server";
import { verifyToken, AUTH_COOKIE } from "@/lib/jwt";

export async function proxy(request) {
  if (/\.[^/]+$/.test(request.nextUrl.pathname)) return NextResponse.next();

  const protectedPages = ["/search", "/dashboard", "/admin", "/favorites", "/history", "/images"];
  const needsAuth = protectedPages.some((path) => request.nextUrl.pathname.startsWith(path));
  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname.startsWith("/admin") && session.role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/search/:path*", "/dashboard/:path*", "/favorites/:path*", "/history/:path*", "/images/:path*", "/admin/:path*"]
};
