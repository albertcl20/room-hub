import { PageIntro, SectionCard } from "@/components/platform-sections";
import { getPlatformDesks } from "@/lib/server/platform-data";

export default async function DesksPage() {
  const desks = await getPlatformDesks();

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Desks"
          title="Flexible desk booking as part of the same workplace system."
          copy="A Robin-class workplace platform also handles neighborhoods, hot desks, and daily seat allocation."
        />

        <SectionCard eyebrow="Desk map" title="Desk inventory and assignments" aside={<button className="primary-button">Book a desk</button>}>
          <div className="desk-grid">
            {desks.map((desk) => (
              <article key={desk.id} className={`desk-card desk-${desk.status}`}>
                <div className="room-list-top">
                  <div>
                    <h3>{desk.name}</h3>
                    <p>{desk.neighborhood}</p>
                  </div>
                  <span className={`status-badge status-${desk.status === "available" ? "available" : "occupied"}`}>{desk.status}</span>
                </div>
                <div className="room-list-meta">
                  <span>{desk.floor}</span>
                  <span>{desk.assignedTo ? `Assigned to ${desk.assignedTo}` : "Open for booking"}</span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
