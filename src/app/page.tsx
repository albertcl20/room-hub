import { PageIntro, SectionCard, StatCard, StatGrid } from "@/components/platform-sections";
import { getPlatformOverview } from "@/lib/server/platform-data";

export default async function Home() {
  const overview = await getPlatformOverview();
  const { rooms, meetings, desks, visitors, insights, integration, highlights } = overview;

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Overview"
          title="A Robin-class workplace platform, built as a serious competitor shell."
          copy="Run meeting rooms, desks, visitors, resource booking, status boards, and workplace operations from one place. This version now reads from the database-backed platform layer instead of leaning only on demo arrays."
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

        <SectionCard eyebrow="Competitive modules" title="Category-complete surfaces we’re shaping toward">
          <div className="brief-grid value-grid">
            {highlights.map((highlight) => (
              <div key={highlight.label} className="brief-block value-block">
                <span>{highlight.label}</span>
                <p>{highlight.value}</p>
                <p className="timeline-meta">{highlight.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
