import { prisma } from "@/lib/server/prisma";
import { buildExchangeNotes, desks as demoDesks, rooms as demoRooms, visitors as demoVisitors } from "@/lib/platform";

function mapRoomStatus(status: string) {
  if (status === "ending-soon") return "endingSoon";
  return status;
}

function mapVisitorStatus(status: string) {
  if (status === "checked-in") return "checkedIn";
  return status;
}

export async function bootstrapDemoWorkspace() {
  const existing = await prisma.organization.findFirst({ where: { slug: "demo-hq" } });
  if (existing) {
    return { ok: true, seeded: false, mode: buildExchangeNotes().mode };
  }

  const organization = await prisma.organization.create({
    data: {
      name: "Demo HQ",
      slug: "demo-hq",
      users: {
        create: [
          { name: "David Posada", email: "david@example.com", role: "admin" },
          { name: "Maria Jensen", email: "maria@example.com", role: "manager" },
          { name: "Sofie Hansen", email: "sofie@example.com", role: "employee" },
        ],
      },
      locations: {
        create: [
          { name: "Copenhagen HQ", city: "Copenhagen", timezone: "Europe/Copenhagen" },
          { name: "Aarhus Office", city: "Aarhus", timezone: "Europe/Copenhagen" },
          { name: "Odense Office", city: "Odense", timezone: "Europe/Copenhagen" },
        ],
      },
    },
    include: { users: true, locations: true },
  });

  const copenhagen = organization.locations.find((item) => item.name === "Copenhagen HQ");
  const aarhus = organization.locations.find((item) => item.name === "Aarhus Office");
  const odense = organization.locations.find((item) => item.name === "Odense Office");

  if (!copenhagen || !aarhus || !odense) {
    throw new Error("Failed to create seed locations");
  }

  const floors = await Promise.all([
    prisma.floor.create({ data: { name: "4th floor", locationId: copenhagen.id } }),
    prisma.floor.create({ data: { name: "2nd floor", locationId: copenhagen.id } }),
    prisma.floor.create({ data: { name: "1st floor", locationId: aarhus.id } }),
    prisma.floor.create({ data: { name: "3rd floor", locationId: odense.id } }),
  ]);

  const floorByName = Object.fromEntries(floors.map((floor) => [floor.name, floor]));
  const userByName = Object.fromEntries(organization.users.map((user) => [user.name, user]));
  const locationByName = {
    "Copenhagen HQ": copenhagen,
    "Aarhus Office": aarhus,
    "Odense Office": odense,
  };

  for (const room of demoRooms) {
    const location = locationByName[room.location as keyof typeof locationByName];
    const floor = floorByName[room.floor];
    const createdRoom = await prisma.room.create({
      data: {
        name: room.name,
        email: room.email,
        capacity: room.capacity,
        amenities: JSON.stringify(room.amenities),
        exchangeConnected: room.exchangeConnected,
        status: mapRoomStatus(room.status) as "available" | "occupied" | "endingSoon",
        utilization: room.utilization,
        freeUntil: new Date(room.freeUntil),
        locationId: location.id,
        floorId: floor.id,
      },
    });

    const meetings = [room.currentMeeting, ...room.upcomingMeetings].filter(
      (meeting): meeting is NonNullable<typeof room.currentMeeting> => Boolean(meeting),
    );
    for (const meeting of meetings) {
      const organizer = userByName[meeting.organizer] ?? organization.users[0];
      await prisma.meeting.create({
        data: {
          roomId: createdRoom.id,
          organizerId: organizer.id,
          title: meeting.title,
          start: new Date(meeting.start),
          end: new Date(meeting.end),
          attendees: meeting.attendees,
          externalEventId: meeting.id,
        },
      });
    }
  }

  for (const desk of demoDesks) {
    const location = locationByName[desk.floor === "1st floor" ? "Aarhus Office" : desk.floor === "3rd floor" ? "Odense Office" : "Copenhagen HQ"];
    const floor = floorByName[desk.floor];
    const createdDesk = await prisma.desk.create({
      data: {
        name: desk.name,
        neighborhood: desk.neighborhood,
        status: desk.status,
        locationId: location.id,
        floorId: floor.id,
      },
    });

    if (desk.assignedTo) {
      const user = Object.values(userByName)[0];
      await prisma.deskBooking.create({
        data: {
          deskId: createdDesk.id,
          userId: user.id,
          start: new Date(),
          end: new Date(Date.now() + 8 * 60 * 60 * 1000),
        },
      });
    }
  }

  for (const visitor of demoVisitors) {
    const host = userByName[visitor.host] ?? organization.users[0];
    const location = copenhagen;
    await prisma.visitor.create({
      data: {
        name: visitor.name,
        company: visitor.company,
        arrival: new Date(visitor.arrival),
        status: mapVisitorStatus(visitor.status) as "expected" | "checkedIn" | "late",
        hostId: host.id,
        locationId: location.id,
      },
    });
  }

  return { ok: true, seeded: true, mode: buildExchangeNotes().mode };
}
