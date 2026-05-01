import { NextResponse } from "next/server";
import { buildExchangeNotes, getRooms } from "@/lib/rooms";

export async function GET() {
  return NextResponse.json({
    rooms: getRooms(),
    integration: buildExchangeNotes(),
  });
}
