import { PageIntro, SectionCard, StatCard, StatGrid } from "@/components/platform-sections";
import { buildExchangeNotes, getDesks, getInsights, getMeetings, getRooms, getVisitors } from "@/lib/platform";

export default function Home() {
  const rooms = getRooms();
  const meetings = getMeetings();
  const desks = getDesks();
  const visitors = getVisitors();
  const insights = getInsights();
  const integration = buildExchangeNotes();

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Overview"
          title="A full workplace management platform, not just a room card wall."
          copy="Run meeting rooms, desks, visitors, and office operations from one place. This version broadens the product into a real Robin-style platform shell with multiple workflows and admin surfaces."
          actions={<button className="primary-button">Launch workplace day</button>}
        />

        <StatGrid>
          <StatCard label="Rooms" value={String(rooms.length)} note="Exchange-connected meeting spaces" />
          <StatCard label="Meetings today" value={String(meetings.length)} note="Live + upcoming room meetings" />
          <StatCard label="Desk inventory" value={String(desks.length)} note="Flexible workspace supply" />
          <StatCard label="Visitors" value={String(visitors.length)} note="Front desk arrivals in motion" />
        </StatGrid>

        <div className="platform-content-grid">
          <SectionCard eyebrow="Operations" title="Today’s workplace control center">
            <div className="command-grid">
              {insights.map((insight) => (
                <article key={insight.label} className="timeline-item">
                  <div>
                    <p className="timeline-range">{insight.label}</p>
                    <h3>{insight.value}</h3>
                    <p className="timeline-meta">{insight.trend}</p>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Platform health" title="Integration and control posture">
            <div className="integration-box">
              <p><strong>Data mode:</strong> {integration.mode}</p>
              <p><strong>Tenant configured:</strong> {integration.tenantConfigured ? "yes" : "no"}</p>
              <p><strong>Client configured:</strong> {integration.clientConfigured ? "yes" : "no"}</p>
              <p><strong>Secret configured:</strong> {integration.secretConfigured ? "yes" : "no"}</p>
              <p className="integration-note">{integration.note}</p>
            </div>
          </SectionCard>
        </div>

        <div className="platform-content-grid">
          <SectionCard eyebrow="Modules" title="Core product surfaces shipping in this build">
            <div className="brief-grid value-grid">
              <div className="brief-block value-block"><span>Rooms</span><p>Availability, timelines, in-room actions, room inventory, and live meeting state.</p></div>
              <div className="brief-block value-block"><span>Meetings</span><p>Daily schedule, organizer view, and booking/extension control surface.</p></div>
              <div className="brief-block value-block"><span>Desks</span><p>Flexible desk booking and neighborhood occupancy.</p></div>
              <div className="brief-block value-block"><span>Visitors</span><p>Expected arrivals, hosts, check-in state, and front-desk context.</p></div>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Why this is different" title="Closer to a product platform than a landing-page fakeout">
            <ul className="plain-list">
              <li>Multiple real routes instead of one dashboard page pretending to be a platform.</li>
              <li>Shared design system and navigation shell.</li>
              <li>API endpoints already in place for room operations.</li>
              <li>Structured to swap demo data for Microsoft Graph-backed workplace data.</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
