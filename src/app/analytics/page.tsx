import { PageIntro, SectionCard, StatCard, StatGrid } from "@/components/platform-sections";
import { getInsights } from "@/lib/platform";

export default function AnalyticsPage() {
  const insights = getInsights();

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Analytics"
          title="Utilization, occupancy, and no-show signals for workplace planning."
          copy="A Robin-style platform needs reporting and planning surfaces, not just booking controls. This page sets up the analytics layer."
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
