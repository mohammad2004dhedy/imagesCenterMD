import { NextResponse } from "next/server";

export function ok(data, init) {
  return NextResponse.json({ ok: true, ...data }, init);
}

export function fail(message, status = 400, details) {
  return NextResponse.json({ ok: false, message, details }, { status });
}
