"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/admin/AdminShell";
import { AdminButton } from "@/admin/AdminButton";
import { SkeletonCard } from "@/admin/Skeleton";
import styles from "@/admin/admin.module.css";

export default function AdminSettingsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [excludeIps, setExcludeIps] = useState<string[]>([]);
  const [currentIp, setCurrentIp] = useState("");
  const [skipBrowser, setSkipBrowser] = useState(false);
  const [ipText, setIpText] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [me, analytics] = await Promise.all([
        fetch("/api/admin/me").then((r) => r.json()),
        fetch("/api/admin/analytics/settings").then((r) => r.json()),
      ]);
      if (me.email) setEmail(me.email);
      if (analytics.excludeIps) {
        setExcludeIps(analytics.excludeIps);
        setIpText(analytics.excludeIps.join("\n"));
      }
      if (analytics.currentIp) setCurrentIp(analytics.currentIp);
      setSkipBrowser(document.cookie.includes("ms_skip_analytics=1"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(payload: Record<string, unknown>) {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/analytics/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg("Save failed");
        return;
      }
      if (data.excludeIps) {
        setExcludeIps(data.excludeIps);
        setIpText(data.excludeIps.join("\n"));
      }
      setMsg("Saved.");
      if (typeof payload.skipBrowser === "boolean") setSkipBrowser(payload.skipBrowser);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell
      email={email}
      title="Settings"
      subtitle="Analytics exclusions so your own testing does not pollute real visitor data"
    >
      {loading ? (
        <SkeletonCard lines={4} />
      ) : (
        <div className={styles.panel}>
          <div className={styles.card}>
            <h2 className={styles.itemCardTitle}>Don&apos;t track my browser</h2>
            <p className={styles.muted}>
              Sets a cookie so visits from this browser are ignored (best for local testing).
            </p>
            <div className={styles.row} style={{ marginTop: "0.75rem" }}>
              <AdminButton
                variant={skipBrowser ? "dark" : "primary"}
                loading={saving}
                onClick={() => save({ skipBrowser: !skipBrowser, excludeIps })}
              >
                {skipBrowser ? "Tracking skipped on this browser" : "Exclude this browser"}
              </AdminButton>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.itemCardTitle}>Exclude IPs</h2>
            <p className={styles.muted}>
              Your current IP: <strong>{currentIp || "unknown"}</strong>. Add home/office IPs (one per line).
            </p>
            <label className={styles.label} style={{ marginTop: "0.75rem" }}>
              Excluded IPs
              <textarea className={styles.textarea} value={ipText} onChange={(e) => setIpText(e.target.value)} />
            </label>
            <div className={styles.row}>
              <AdminButton
                variant="primary"
                loading={saving}
                onClick={() =>
                  save({
                    excludeIps: ipText
                      .split("\n")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  })
                }
              >
                Save IP list
              </AdminButton>
              <AdminButton
                loading={saving}
                onClick={() =>
                  save({
                    addCurrentIp: true,
                    excludeIps: ipText
                      .split("\n")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  })
                }
              >
                Add my current IP
              </AdminButton>
            </div>
            {excludeIps.length ? (
              <p className={styles.muted}>Active exclusions: {excludeIps.join(", ")}</p>
            ) : null}
            {msg ? <p className={styles.toast}>{msg}</p> : null}
          </div>

          <div className={styles.card}>
            <p className={styles.muted} style={{ margin: 0 }}>
              Landing CMS and content tools live under Landing / Projects / Experience.
            </p>
            <div className={styles.row} style={{ marginTop: "1rem" }}>
              <Link href="/admin/landing" className={`${styles.btn} ${styles.btnPrimary}`}>
                Open Landing CMS
              </Link>
              <Link href="/admin/analytics" className={styles.btn}>
                Analytics
              </Link>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
