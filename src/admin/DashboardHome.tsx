"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SkeletonCard } from "@/admin/Skeleton";
import styles from "@/admin/admin.module.css";

type Payload = {
  stats: {
    totalVisits: number;
    todayVisits: number;
    weekVisits: number;
    unread: number;
    messages: number;
    publishedProjects: number;
    projects: number;
    avgDaily: number;
  };
  weekSeries: { date: string; visits: number }[];
  topProjects: { id: string; name: string; visits: number; published: boolean }[];
  recentLeads: {
    id: string;
    name: string;
    email: string;
    preview: string;
    read: boolean;
    replied: boolean;
    createdAt: string;
  }[];
};

export function DashboardHome() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/analytics?days=7");
        const json = await res.json();
        if (!alive) return;
        if (json.ok) {
          setData(json);
          setError("");
        } else setError("Could not load dashboard.");
      } catch {
        if (alive) setError("Network error loading dashboard.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    const id = window.setInterval(load, 15000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  if (loading && !data) {
    return (
      <div className={styles.stats6}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!data) return <p className={styles.error}>{error || "Could not load dashboard."}</p>;

  const { stats } = data;
  const weekSeries = data.weekSeries?.length
    ? data.weekSeries
    : [{ date: new Date().toISOString().slice(0, 10), visits: 0 }];

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <span className={styles.muted} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", margin: 0 }}>
          <span className={styles.liveDot} /> Live · refreshes every 15s
        </span>
        <div className={styles.toolbarActions}>
          <Link href="/admin/visits" className={styles.btn}>
            Visit history
          </Link>
          <Link href="/admin/analytics" className={`${styles.btn} ${styles.btnDark}`}>
            Analytics
          </Link>
        </div>
      </div>

      <div className={styles.stats6}>
        <div className={`${styles.card} ${styles.cardAccent}`}>
          <p className={styles.cardLabel}>Total visits</p>
          <p className={styles.cardValue}>{stats.totalVisits}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Today</p>
          <p className={styles.cardValue}>{stats.todayVisits}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Last 7 days</p>
          <p className={styles.cardValue}>{stats.weekVisits}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Unread leads</p>
          <p className={styles.cardValue}>{stats.unread}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Projects live</p>
          <p className={styles.cardValue}>{stats.publishedProjects}</p>
          <p className={styles.muted}>{stats.projects} total</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Avg / day</p>
          <p className={styles.cardValue}>{stats.avgDaily}</p>
        </div>
      </div>

      <div className={styles.dashMain}>
        <div className={`${styles.card} ${styles.chartCard}`}>
          <div className={styles.panelHead}>
            <h3 className={styles.chartTitle}>Visitors · last 7 days</h3>
            <Link href="/admin/analytics" className={styles.textLink}>
              Open analytics
            </Link>
          </div>
          {ready ? (
            <div className={styles.chartFrame}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekSeries}>
                  <defs>
                    <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#eb3514" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#eb3514" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => String(v).slice(5)} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                  <Tooltip />
                  <Area type="monotone" dataKey="visits" stroke="#eb3514" fill="url(#dashFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className={styles.muted}>Loading chart…</p>
          )}
        </div>

        <div className={styles.dashSide}>
          <div className={styles.card}>
            <div className={styles.panelHead}>
              <h3 className={styles.chartTitle}>Top projects</h3>
              <Link href="/admin/projects" className={styles.textLink}>
                Manage
              </Link>
            </div>
            <ul className={styles.rankList}>
              {data.topProjects.map((p, i) => (
                <li key={p.id} className={styles.rankItem}>
                  <span className={styles.rankIndex}>{i + 1}</span>
                  <div className={styles.rankBody}>
                    <p className={styles.rankTitle}>{p.name}</p>
                    <p className={styles.muted}>{p.visits} page views</p>
                  </div>
                  <Link href={`/work/${p.id}`} className={styles.textLink} target="_blank" rel="noreferrer">
                    View
                  </Link>
                </li>
              ))}
              {!data.topProjects.length ? <li className={styles.muted}>No project views yet.</li> : null}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.panelHead}>
              <h3 className={styles.chartTitle}>Contact leads</h3>
              <Link href="/admin/messages" className={styles.textLink}>
                Inbox ({stats.messages})
              </Link>
            </div>
            <ul className={styles.rankList}>
              {data.recentLeads.map((m) => (
                <li key={m.id} className={styles.rankItem}>
                  <div className={styles.rankBody}>
                    <p className={styles.rankTitle}>
                      {m.name}
                      {!m.read ? <span className={styles.badge}>New</span> : null}
                      {m.replied ? <span className={`${styles.badge} ${styles.badgeOk}`}>Replied</span> : null}
                    </p>
                    <p className={styles.muted}>{m.email}</p>
                    <p className={styles.leadPreview}>{m.preview}</p>
                  </div>
                </li>
              ))}
              {!data.recentLeads.length ? <li className={styles.muted}>No leads yet.</li> : null}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
