# Room Hub

Robin-inspired meeting room management app with Microsoft Exchange-backed room calendar integration.

## What it does

- Shows a portfolio of connected meeting rooms
- Displays real-time room state: available, occupied, ending soon
- Shows current meeting and upcoming meetings for each room
- Supports room actions via API shape:
  - book now
  - extend meeting
  - end early
  - release room
- Includes a password gate via `APP_PASSWORD`
- Ships in demo mode first, but is structured to switch to Microsoft Graph-backed data

## Current architecture

- `src/lib/platform.ts`
  - platform demo data for rooms, meetings, desks, visitors, insights
- `src/lib/server/prisma.ts`
  - shared Prisma client
- `prisma/schema.prisma`
  - initial relational model for orgs, users, locations, floors, rooms, meetings, desks, bookings, visitors
- `src/app/api/rooms`
  - room list endpoint
- `src/app/api/rooms/[roomId]/availability`
  - availability endpoint
- `src/app/api/rooms/[roomId]/actions`
  - mutation endpoint shape for room actions
- `src/app/api/platform/bootstrap`
  - demo workspace bootstrap endpoint for the database-backed foundation

## Environment variables

```bash
DATABASE_URL=file:./dev.db
APP_PASSWORD=your-password
ROOM_HUB_DATA_MODE=database # demo | database | graph (graph wiring still pending)
MICROSOFT_TENANT_ID=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
```

## Run

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run dev
npm run build
```

## Notes on Microsoft integration

To connect this to real Exchange room calendars, wire the API handlers to Microsoft Graph using application permissions for room mailbox calendar reads and controlled write actions for booking/ending/extending room events.

The UI is already built around that model, so replacing demo data does not require rebuilding the product surface.
