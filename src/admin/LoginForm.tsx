"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./LoginForm.module.css";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";
  const [email, setEmail] = useState("shoaib.octachat@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.brandRow}>
            <span className={styles.mark}>MS</span>
            Portfolio Admin
          </div>
          <div className={styles.heroCopy}>
            <h1>Operate your site from one calm control room.</h1>
            <p>
              Live visitors, landing CMS, projects and lead replies — secured, fast, and built for daily use.
            </p>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <b>Live</b>
              <span>Visitor intel</span>
            </div>
            <div className={styles.stat}>
              <b>CMS</b>
              <span>Full landing</span>
            </div>
            <div className={styles.stat}>
              <b>Inbox</b>
              <span>Reply leads</span>
            </div>
          </div>
        </aside>

        <form className={styles.panel} onSubmit={onSubmit}>
          <div className={styles.panelHead}>
            <h2>Sign in</h2>
            <p>Use your admin credentials to continue.</p>
          </div>

          <div className={styles.form}>
            <label className={styles.label}>
              Email
              <input
                className={styles.input}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className={styles.label}>
              Password
              <input
                className={styles.input}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error ? <p className={styles.error}>{error}</p> : null}
            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
              {loading ? "Signing in…" : "Sign in to dashboard"}
            </button>
          </div>
          <p className={styles.foot}>Protected area · session secured with HTTP-only cookie</p>
        </form>
      </div>
    </div>
  );
}
