import { PageIntro, SectionCard } from "@/components/platform-sections";
import { formatShortDateTime, getVisitors } from "@/lib/platform";

export default function VisitorsPage() {
  const visitors = getVisitors();

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Visitors"
          title="Front-desk and guest operations belong in the same platform."
          copy="Track expected arrivals, hosts, companies, and check-in status without splitting workplace operations across random tools."
        />

        <SectionCard eyebrow="Arrivals" title="Today’s visitor board" aside={<button className="primary-button">Invite visitor</button>}>
          <div className="timeline-list">
            {visitors.map((visitor) => (
              <article key={visitor.id} className="timeline-item timeline-item-rich">
                <div>
                  <p className="timeline-range">{formatShortDateTime(visitor.arrival)}</p>
                  <h3>{visitor.name}</h3>
                  <p className="timeline-meta">Host: {visitor.host} · {visitor.company}</p>
                </div>
                <span className={`status-badge status-${visitor.status === "checked-in" ? "available" : visitor.status === "late" ? "ending-soon" : "occupied"}`}>{visitor.status}</span>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
