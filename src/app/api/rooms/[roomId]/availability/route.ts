import { NextRequest, NextResponse } from "next/server";
import { getRoom, minutesUntil } from "@/lib/rooms";

export async function GET(_request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await context.params;
  const room = getRoom(roomId);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({
    roomId: room.id,
    availableNow: room.status === "available",
    minutesUntilNextMeeting: Math.max(0, minutesUntil(room.freeUntil)),
    freeUntil: room.freeUntil,
  });
}
