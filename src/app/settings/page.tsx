import { PageIntro, SectionCard } from "@/components/platform-sections";
import { buildExchangeNotes } from "@/lib/platform";

export default function SettingsPage() {
  const integration = buildExchangeNotes();

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Settings"
          title="Admin policies, integrations, and workplace controls."
          copy="A real competitor needs more than booking surfaces. It needs the admin layer: integrations, policies, defaults, permissions, and rollout controls."
        />

        <div className="platform-content-grid">
          <SectionCard eyebrow="Integrations" title="Calendar and identity stack">
            <div className="integration-box">
              <p><strong>Calendar mode:</strong> {integration.mode}</p>
              <p><strong>Microsoft tenant:</strong> {integration.tenantConfigured ? "configured" : "missing"}</p>
              <p><strong>Client app:</strong> {integration.clientConfigured ? "configured" : "missing"}</p>
              <p><strong>Client secret:</strong> {integration.secretConfigured ? "configured" : "missing"}</p>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Policies" title="Operational controls">
            <ul className="plain-list">
              <li>Auto-release no-show meetings after grace period</li>
              <li>Desk neighborhood priority windows</li>
              <li>Visitor pre-registration and host notifications</li>
              <li>Check-in rules via QR, NFC, or Wi‑Fi presence</li>
              <li>Status board behavior and room-display branding</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
