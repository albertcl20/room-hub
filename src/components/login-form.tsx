"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Wrong password. The room display remains unimpressed.");
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="stack-gap">
      <label className="field">
        <span>Password</span>
        <input className="input" type="password" autoFocus value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      {error ? <p className="error-text">{error}</p> : null}
      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "Checking…" : "Unlock Room Hub"}
      </button>
    </form>
  );
}
