export type Meeting = {
  id: string;
  title: string;
  organizer: string;
  start: string;
  end: string;
  attendees: number;
  status: "live" | "upcoming" | "done";
  roomId?: string;
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

export type Desk = {
  id: string;
  name: string;
  neighborhood: string;
  floor: string;
  status: "available" | "booked";
  assignedTo?: string;
};

export type Visitor = {
  id: string;
  name: string;
  host: string;
  company: string;
  arrival: string;
  status: "expected" | "checked-in" | "late";
};

export type Insight = {
  label: string;
  value: string;
  trend: string;
};

const now = new Date();

function isoOffset(minutes: number) {
  return new Date(now.getTime() + minutes * 60_000).toISOString();
}

export const rooms: Room[] = [
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
      roomId: "aurora-1",
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
        roomId: "aurora-1",
      },
      {
        id: "m-3",
        title: "Customer escalation review",
        organizer: "Thomas Berg",
        start: isoOffset(135),
        end: isoOffset(180),
        attendees: 4,
        status: "upcoming",
        roomId: "aurora-1",
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
        roomId: "fjord-2",
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
      roomId: "atlas-7",
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
        roomId: "atlas-7",
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

export const desks: Desk[] = [
  { id: "d-1", name: "A-12", neighborhood: "North Wing", floor: "4th floor", status: "available" },
  { id: "d-2", name: "A-14", neighborhood: "North Wing", floor: "4th floor", status: "booked", assignedTo: "Mikkel" },
  { id: "d-3", name: "B-07", neighborhood: "Focus Zone", floor: "2nd floor", status: "booked", assignedTo: "Nadia" },
  { id: "d-4", name: "C-03", neighborhood: "Studio", floor: "1st floor", status: "available" },
  { id: "d-5", name: "C-09", neighborhood: "Studio", floor: "1st floor", status: "available" },
  { id: "d-6", name: "D-21", neighborhood: "Collab Corner", floor: "3rd floor", status: "booked", assignedTo: "Jonas" },
];

export const visitors: Visitor[] = [
  { id: "v-1", name: "Emma Collins", host: "David Posada", company: "Contoso", arrival: isoOffset(15), status: "expected" },
  { id: "v-2", name: "Rasmus Valeur", host: "Maria Jensen", company: "Deloitte", arrival: isoOffset(-12), status: "checked-in" },
  { id: "v-3", name: "Sana Malik", host: "Thomas Berg", company: "Novo Nordisk", arrival: isoOffset(-5), status: "late" },
];

export const insights: Insight[] = [
  { label: "Meeting room utilization", value: "61%", trend: "+8% vs last week" },
  { label: "Desk occupancy", value: "74%", trend: "+11% Tue-Thu peak" },
  { label: "No-show risk", value: "9 rooms", trend: "AI flagged 3 recoverable slots" },
  { label: "Visitor throughput", value: "28", trend: "Smooth front-desk today" },
];

export function getRooms() {
  return rooms;
}

export function getRoom(roomId: string) {
  return rooms.find((room) => room.id === roomId);
}

export function getMeetings() {
  return rooms.flatMap((room) => [room.currentMeeting, ...room.upcomingMeetings].filter(Boolean) as Meeting[]);
}

export function getDesks() {
  return desks;
}

export function getVisitors() {
  return visitors;
}

export function getInsights() {
  return insights;
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

export function formatShortDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-DK", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
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
        : "Demo mode. Platform shell is live; switch ROOM_HUB_DATA_MODE=graph and add Microsoft env vars to connect real workplace data.",
  };
}
