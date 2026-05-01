import { NextRequest, NextResponse } from "next/server";
import { getRoom } from "@/lib/rooms";

const allowed = new Set(["book-now", "extend", "end-early", "release-room"]);

export async function POST(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await context.params;
  const room = getRoom(roomId);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as { action?: string; durationMinutes?: number };

  if (!body.action || !allowed.has(body.action)) {
    return NextResponse.json({ error: "Unsupported room action" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    roomId: room.id,
    action: body.action,
    durationMinutes: body.durationMinutes ?? null,
    mode: process.env.ROOM_HUB_DATA_MODE === "graph" ? "graph" : "demo",
    message:
      process.env.ROOM_HUB_DATA_MODE === "graph"
        ? "Action accepted. Wire this handler to Graph/Exchange mutation logic for the target room mailbox."
        : `Demo action completed: ${body.action} for ${room.name}`,
  });
}
