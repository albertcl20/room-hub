import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "room-hub-auth";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.APP_PASSWORD?.trim();

  if (!expected) {
    return NextResponse.json({ ok: true });
  }

  if (body.password?.trim() !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
