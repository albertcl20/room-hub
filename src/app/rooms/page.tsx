import { PageIntro } from "@/components/platform-sections";
import { RoomsPageClient } from "@/components/rooms/rooms-page-client";
import { getPlatformRooms } from "@/lib/server/platform-data";

export default async function RoomsPage() {
  const rooms = await getPlatformRooms();

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Rooms"
          title="Manage every meeting room like a live operational asset."
          copy="View live occupancy, upcoming bookings, amenities, and quick actions for every connected room."
        />

        <RoomsPageClient rooms={rooms} />
      </div>
    </main>
  );
}
