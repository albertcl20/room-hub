import { LoginForm } from "@/components/login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/";

  return (
    <main className="page-shell centered-shell">
      <div className="page-grid narrow-grid">
        <section className="card stack-gap">
          <div>
            <span className="eyebrow">Protected workplace app</span>
            <h1 className="login-title">Unlock Room Hub</h1>
            <p className="login-copy">
              This app is built for real room calendars and live meeting controls, so it stays behind a password when you want it to.
            </p>
          </div>
          <LoginForm next={next} />
        </section>
      </div>
    </main>
  );
}
