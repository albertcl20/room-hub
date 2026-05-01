import { NextResponse } from "next/server";
import { getPlatformRooms } from "@/lib/server/platform-data";
import { buildExchangeNotes } from "@/lib/rooms";

export async function GET() {
  return NextResponse.json({
    rooms: await getPlatformRooms(),
    integration: buildExchangeNotes(),
  });
}
