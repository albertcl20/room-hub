import { NextResponse } from "next/server";
import { getPlatformMeetings } from "@/lib/server/platform-data";

export async function GET() {
  return NextResponse.json({ meetings: await getPlatformMeetings() });
}
