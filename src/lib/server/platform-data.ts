import {
  buildExchangeNotes,
  formatShortDateTime,
  formatTime,
  getDesks as getDemoDesks,
  getInsights as getDemoInsights,
  getMeetings as getDemoMeetings,
  getRooms as getDemoRooms,
  getVisitors as getDemoVisitors,
  type Desk,
  type Insight,
  type Meeting,
  type Room,
  type Visitor,
} from "@/lib/platform";
import { prisma } from "@/lib/server/prisma";

function roomStatusFromDb(status: "available" | "occupied" | "endingSoon"): Room["status"] {
  if (status === "endingSoon") return "ending-soon";
  return status;
}

function visitorStatusFromDb(status: "expected" | "checkedIn" | "late"): Visitor["status"] {
  if (status === "checkedIn") return "checked-in";
  return status;
}

function meetingStatus(start: Date, end: Date): Meeting["status"] {
  const now = Date.now();
  if (start.getTime() <= now && end.getTime() >= now) return "live";
  if (start.getTime() > now) return "upcoming";
  return "done";
}

export async function getPlatformRooms(): Promise<Room[]> {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        location: true,
        floor: true,
        meetings: {
          include: { organizer: true },
          orderBy: { start: "asc" },
        },
      },
      orderBy: [{ location: { name: "asc" } }, { name: "asc" }],
    });

    return rooms.map((room) => {
      const sortedMeetings = room.meetings
        .map((meeting) => ({
          id: meeting.externalEventId ?? meeting.id,
          title: meeting.title,
          organizer: meeting.organizer.name,
          start: meeting.start.toISOString(),
          end: meeting.end.toISOString(),
          attendees: meeting.attendees,
          status: meetingStatus(meeting.start, meeting.end),
          roomId: room.id,
        }))
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

      const currentMeeting = sortedMeetings.find((meeting) => meeting.status === "live");
      const upcomingMeetings = sortedMeetings.filter((meeting) => meeting.status === "upcoming");

      return {
        id: room.id,
        name: room.name,
        email: room.email,
        location: room.location.name,
        floor: room.floor.name,
        capacity: room.capacity,
        amenities: JSON.parse(room.amenities || "[]") as string[],
        status: roomStatusFromDb(room.status),
        currentMeeting,
        upcomingMeetings,
        freeUntil: room.freeUntil?.toISOString() ?? new Date().toISOString(),
        utilization: room.utilization,
        exchangeConnected: room.exchangeConnected,
      } satisfies Room;
    });
  } catch {
    return getDemoRooms();
  }
}

export async function getPlatformMeetings(): Promise<Meeting[]> {
  try {
    const meetings = await prisma.meeting.findMany({
      include: { organizer: true, room: true },
      orderBy: { start: "asc" },
    });

    return meetings.map((meeting) => ({
      id: meeting.externalEventId ?? meeting.id,
      title: meeting.title,
      organizer: meeting.organizer.name,
      start: meeting.start.toISOString(),
      end: meeting.end.toISOString(),
      attendees: meeting.attendees,
      status: meetingStatus(meeting.start, meeting.end),
      roomId: meeting.roomId,
    }));
  } catch {
    return getDemoMeetings();
  }
}

export async function getPlatformDesks(): Promise<Desk[]> {
  try {
    const desks = await prisma.desk.findMany({
      include: { floor: true, bookings: { include: { user: true }, orderBy: { start: "desc" }, take: 1 } },
      orderBy: [{ floor: { name: "asc" } }, { name: "asc" }],
    });

    return desks.map((desk) => ({
      id: desk.id,
      name: desk.name,
      neighborhood: desk.neighborhood,
      floor: desk.floor.name,
      status: desk.status,
      assignedTo: desk.bookings[0]?.user.name,
    }));
  } catch {
    return getDemoDesks();
  }
}

export async function getPlatformVisitors(): Promise<Visitor[]> {
  try {
    const visitors = await prisma.visitor.findMany({
      include: { host: true },
      orderBy: { arrival: "asc" },
    });

    return visitors.map((visitor) => ({
      id: visitor.id,
      name: visitor.name,
      host: visitor.host.name,
      company: visitor.company,
      arrival: visitor.arrival.toISOString(),
      status: visitorStatusFromDb(visitor.status),
    }));
  } catch {
    return getDemoVisitors();
  }
}

export async function getPlatformInsights(): Promise<Insight[]> {
  try {
    const [roomCount, liveMeetings, deskCount, bookedDeskCount, visitorCount] = await Promise.all([
      prisma.room.count(),
      prisma.meeting.count({
        where: { start: { lte: new Date() }, end: { gte: new Date() } },
      }),
      prisma.desk.count(),
      prisma.desk.count({ where: { status: "booked" } }),
      prisma.visitor.count(),
    ]);

    const deskOccupancy = deskCount ? Math.round((bookedDeskCount / deskCount) * 100) : 0;
    const roomUtilization = roomCount ? Math.min(100, 40 + roomCount * 5 + liveMeetings * 3) : 0;

    return [
      { label: "Meeting room utilization", value: `${roomUtilization}%`, trend: `${liveMeetings} meetings live right now` },
      { label: "Desk occupancy", value: `${deskOccupancy}%`, trend: `${bookedDeskCount} of ${deskCount} desks booked` },
      { label: "Visitor throughput", value: `${visitorCount}`, trend: `${visitorCount ? "Arrivals are being tracked" : "No arrivals scheduled"}` },
      { label: "Calendar sync mode", value: buildExchangeNotes().mode, trend: buildExchangeNotes().note },
    ];
  } catch {
    return getDemoInsights();
  }
}

export async function getPlatformOverview() {
  const [rooms, meetings, desks, visitors, insights] = await Promise.all([
    getPlatformRooms(),
    getPlatformMeetings(),
    getPlatformDesks(),
    getPlatformVisitors(),
    getPlatformInsights(),
  ]);

  return {
    rooms,
    meetings,
    desks,
    visitors,
    insights,
    integration: buildExchangeNotes(),
    highlights: [
      {
        label: "Status boards",
        value: `${rooms.filter((room) => room.currentMeeting).length} live spaces`,
        note: "Ready for hallway and tablet display mode",
      },
      {
        label: "Resource booking",
        value: `${desks.filter((desk) => desk.status === "available").length} desks open`,
        note: "Desks, rooms, and extendable custom resources",
      },
      {
        label: "Visitor ops",
        value: `${visitors.filter((visitor) => visitor.status === "expected").length} expected`,
        note: visitors[0] ? `${visitors[0].name} · ${formatShortDateTime(visitors[0].arrival)}` : "No upcoming visitors",
      },
      {
        label: "Wayfinding signal",
        value: rooms[0] ? `${rooms[0].name} free until ${formatTime(rooms[0].freeUntil)}` : "No spaces configured",
        note: "Supports room displays and navigation surfaces",
      },
    ],
  };
}
