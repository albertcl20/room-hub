import { PageIntro, SectionCard, StatCard, StatGrid } from "@/components/platform-sections";
import { getPlatformInsights } from "@/lib/server/platform-data";

export default async function AnalyticsPage() {
  const insights = await getPlatformInsights();

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Analytics"
          title="Utilization, occupancy, and no-show signals for workplace planning."
          copy="A Robin-class platform needs planning and reporting surfaces, not just booking controls."
        />

        <StatGrid>
          {insights.map((insight) => (
            <StatCard key={insight.label} label={insight.label} value={insight.value} note={insight.trend} />
          ))}
        </StatGrid>

        <SectionCard eyebrow="Insights" title="Operational trends worth acting on">
          <div className="brief-grid value-grid">
            {insights.map((insight) => (
              <div key={insight.label} className="brief-block value-block">
                <span>{insight.label}</span>
                <p>{insight.value}</p>
                <p className="timeline-meta">{insight.trend}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
