import { ReactNode } from "react";

export function PageIntro({ eyebrow, title, copy, actions }: { eyebrow: string; title: string; copy: string; actions?: ReactNode }) {
  return (
    <section className="card page-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {actions ? <div className="page-intro-actions">{actions}</div> : null}
    </section>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <section className="metric-grid top-metrics">{children}</section>;
}

export function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="metric cardless-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

export function SectionCard({ title, eyebrow, children, aside }: { title: string; eyebrow: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="card stack-gap">
      <div className="section-header compact">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}
