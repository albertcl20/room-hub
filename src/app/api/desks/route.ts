import { NextResponse } from "next/server";
import { getPlatformDesks } from "@/lib/server/platform-data";

export async function GET() {
  return NextResponse.json({ desks: await getPlatformDesks() });
}
