import { PageIntro, SectionCard, StatCard, StatGrid } from "@/components/platform-sections";
import { getPlatformDesks, getPlatformRooms } from "@/lib/server/platform-data";

export default async function ResourcesPage() {
  const [rooms, desks] = await Promise.all([getPlatformRooms(), getPlatformDesks()]);
  const availableRooms = rooms.filter((room) => room.status === "available").length;
  const availableDesks = desks.filter((desk) => desk.status === "available").length;

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Resources"
          title="Unified resource booking across rooms, desks, parking, lockers, and more."
          copy="This is the product surface for the broader resource-booking story: not just desks and rooms, but the category expansion a real competitor needs."
        />

        <StatGrid>
          <StatCard label="Meeting rooms" value={String(rooms.length)} note={`${availableRooms} available right now`} />
          <StatCard label="Desks" value={String(desks.length)} note={`${availableDesks} open for booking`} />
          <StatCard label="Parking" value="24" note="Modeled as a bookable resource type" />
          <StatCard label="Lockers" value="60" note="Candidate custom resource inventory" />
        </StatGrid>

        <SectionCard eyebrow="Resource types" title="Everything bookable in one system">
          <div className="brief-grid value-grid">
            <div className="brief-block value-block"><span>Rooms</span><p>Schedule spaces, extend meetings, resolve conflicts, and power tablet displays.</p></div>
            <div className="brief-block value-block"><span>Desks</span><p>Hot desks, team neighborhoods, assigned seating, and in-office planning.</p></div>
            <div className="brief-block value-block"><span>Parking</span><p>Shared inventory for employees and visitors with bookable availability windows.</p></div>
            <div className="brief-block value-block"><span>Custom resources</span><p>Lockers, labs, equipment, pods, or anything else operations wants to manage.</p></div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
