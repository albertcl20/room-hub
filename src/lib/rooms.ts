export type Meeting = {
  id: string;
  title: string;
  organizer: string;
  start: string;
  end: string;
  attendees: number;
  status: "live" | "upcoming" | "done";
};

export type Room = {
  id: string;
  name: string;
  email: string;
  location: string;
  floor: string;
  capacity: number;
  amenities: string[];
  status: "available" | "occupied" | "ending-soon";
  currentMeeting?: Meeting;
  upcomingMeetings: Meeting[];
  freeUntil: string;
  utilization: number;
  exchangeConnected: boolean;
};

const now = new Date();

function isoOffset(minutes: number) {
  return new Date(now.getTime() + minutes * 60_000).toISOString();
}

export const demoRooms: Room[] = [
  {
    id: "aurora-1",
    name: "Aurora One",
    email: "aurora-one@company.com",
    location: "Copenhagen HQ",
    floor: "4th floor",
    capacity: 10,
    amenities: ["Teams Room", "Whiteboard", "HDMI-C", "AirPlay"],
    status: "occupied",
    currentMeeting: {
      id: "m-1",
      title: "Central weekly product sync",
      organizer: "David Posada",
      start: isoOffset(-18),
      end: isoOffset(27),
      attendees: 7,
      status: "live",
    },
    upcomingMeetings: [
      {
        id: "m-2",
        title: "Graph migration checkpoint",
        organizer: "Sofie Hansen",
        start: isoOffset(40),
        end: isoOffset(100),
        attendees: 5,
        status: "upcoming",
      },
      {
        id: "m-3",
        title: "Customer escalation review",
        organizer: "Thomas Berg",
        start: isoOffset(135),
        end: isoOffset(180),
        attendees: 4,
        status: "upcoming",
      },
    ],
    freeUntil: isoOffset(40),
    utilization: 86,
    exchangeConnected: true,
  },
  {
    id: "fjord-2",
    name: "Fjord Two",
    email: "fjord-two@company.com",
    location: "Copenhagen HQ",
    floor: "2nd floor",
    capacity: 6,
    amenities: ["Teams Room", "USB-C dock"],
    status: "available",
    upcomingMeetings: [
      {
        id: "m-4",
        title: "Design review",
        organizer: "Lone Nielsen",
        start: isoOffset(25),
        end: isoOffset(70),
        attendees: 4,
        status: "upcoming",
      },
    ],
    freeUntil: isoOffset(25),
    utilization: 58,
    exchangeConnected: true,
  },
  {
    id: "atlas-7",
    name: "Atlas Seven",
    email: "atlas-seven@company.com",
    location: "Aarhus Office",
    floor: "1st floor",
    capacity: 18,
    amenities: ["Teams Room", "Dual display", "Whiteboard", "Camera tracking"],
    status: "ending-soon",
    currentMeeting: {
      id: "m-5",
      title: "Partner QBR",
      organizer: "Maria Jensen",
      start: isoOffset(-52),
      end: isoOffset(8),
      attendees: 11,
      status: "live",
    },
    upcomingMeetings: [
      {
        id: "m-6",
        title: "Board prep",
        organizer: "Jonas Frandsen",
        start: isoOffset(20),
        end: isoOffset(80),
        attendees: 6,
        status: "upcoming",
      },
    ],
    freeUntil: isoOffset(20),
    utilization: 77,
    exchangeConnected: true,
  },
  {
    id: "harbor-3",
    name: "Harbor Three",
    email: "harbor-three@company.com",
    location: "Odense Office",
    floor: "3rd floor",
    capacity: 4,
    amenities: ["Monitor", "HDMI-C"],
    status: "available",
    upcomingMeetings: [],
    freeUntil: isoOffset(240),
    utilization: 21,
    exchangeConnected: true,
  },
];

export function getRooms(): Room[] {
  return demoRooms;
}

export function getRoom(roomId: string): Room | undefined {
  return demoRooms.find((room) => room.id === roomId);
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-DK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatRange(start: string, end: string) {
  return `${formatTime(start)}–${formatTime(end)}`;
}

export function minutesUntil(iso: string) {
  return Math.round((new Date(iso).getTime() - Date.now()) / 60_000);
}

export function buildExchangeNotes() {
  return {
    mode: process.env.ROOM_HUB_DATA_MODE === "graph" ? "graph" : "demo",
    tenantConfigured: Boolean(process.env.MICROSOFT_TENANT_ID),
    clientConfigured: Boolean(process.env.MICROSOFT_CLIENT_ID),
    secretConfigured: Boolean(process.env.MICROSOFT_CLIENT_SECRET),
    note:
      process.env.ROOM_HUB_DATA_MODE === "graph"
        ? "Graph mode selected. Wire these endpoints to application-permission calendar reads and room mailbox actions."
        : "Demo mode. UI is live; switch ROOM_HUB_DATA_MODE=graph and add Microsoft env vars to connect real room calendars.",
  };
}
