"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SkeletonCard } from "@/admin/Skeleton";
import styles from "@/admin/admin.module.css";

type AnalyticsPayload = {
  stats: {
    totalVisits: number;
    todayVisits: number;
    weekVisits: number;
    uniqueSessions: number;
    uniqueIps: number;
    messages: number;
    unread: number;
    replied: number;
    projects: number;
    publishedProjects: number;
    experiences: number;
    countriesTracked: number;
  };
  series: { date: string; visits: number }[];
  countries: { name: string; value: number }[];
  paths: { name: string; value: number }[];
  devices: { name: string; value: number }[];
  referrers: { name: string; value: number }[];
  recent: {
    id: string;
    path: string;
    ip: string;
    country: string;
    city: string;
    region?: string;
    location?: string;
    browser?: string;
    os?: string;
    device: string;
    referrer?: string;
    createdAt: string;
  }[];
};

const COLORS = ["#eb3514", "#ff7a59", "#111318", "#6b7280", "#f59e0b", "#22c55e"];

function ChartFrame({ children }: { children: React.ReactNode }) {
  return <div style={{ width: "100%", height: 260, minWidth: 0 }}>{children}</div>;
}

export function DashboardAnalytics() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
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
        const res = await fetch("/api/admin/analytics?days=30");
        const json = await res.json();
        if (!alive) return;
        if (json.ok) {
          setData(json);
          setError("");
        } else {
          setError("Could not load analytics.");
        }
      } catch {
        if (alive) setError("Network error loading analytics.");
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
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className={styles.error}>{error || "Could not load analytics."}</p>;
  }

  const { stats } = data;
  const series = data.series?.length ? data.series : [{ date: new Date().toISOString().slice(0, 10), visits: 0 }];
  const devices = data.devices?.length ? data.devices : [{ name: "none", value: 1 }];
  const countries = data.countries?.length ? data.countries : [{ name: "—", value: 0 }];
  const paths = data.paths?.length ? data.paths : [{ name: "—", value: 0 }];
  const referrers = data.referrers?.length ? data.referrers : [{ name: "—", value: 0 }];

  return (
    <div className={styles.panel}>
      <div className={styles.row} style={{ justifyContent: "space-between" }}>
        <span className={styles.muted} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", margin: 0 }}>
          <span className={styles.liveDot} /> Live from Neon DB · refreshes every 15s
        </span>
        {stats.totalVisits === 0 ? (
          <span className={styles.badge}>Open the homepage once to record the first visit</span>
        ) : null}
      </div>

      <div className={styles.grid}>
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
          <p className={styles.cardLabel}>Unique sessions</p>
          <p className={styles.cardValue}>{stats.uniqueSessions}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Unique IPs</p>
          <p className={styles.cardValue}>{stats.uniqueIps}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Countries</p>
          <p className={styles.cardValue}>{stats.countriesTracked}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Unread messages</p>
          <p className={styles.cardValue}>{stats.unread}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Replied leads</p>
          <p className={styles.cardValue}>{stats.replied}</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Projects</p>
          <p className={styles.cardValue}>{stats.projects}</p>
          <p className={styles.muted}>{stats.publishedProjects} published</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Experience roles</p>
          <p className={styles.cardValue}>{stats.experiences}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Inbox total</p>
          <p className={styles.cardValue}>{stats.messages}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Avg visits / day</p>
          <p className={styles.cardValue}>
            {Math.round((stats.weekVisits / 7) * 10) / 10}
          </p>
        </div>
      </div>

      {ready ? (
        <>
          <div className={styles.charts}>
            <div className={`${styles.card} ${styles.chartCard}`}>
              <h3 className={styles.chartTitle}>Visits (30 days)</h3>
              <ChartFrame>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series}>
                    <defs>
                      <linearGradient id="visitFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#eb3514" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#eb3514" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => String(v).slice(5)} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                    <Tooltip />
                    <Area type="monotone" dataKey="visits" stroke="#eb3514" fill="url(#visitFill)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartFrame>
            </div>

            <div className={`${styles.card} ${styles.chartCard}`}>
              <h3 className={styles.chartTitle}>Devices</h3>
              <ChartFrame>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={devices} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                      {devices.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartFrame>
            </div>
          </div>

          <div className={styles.charts}>
            <div className={`${styles.card} ${styles.chartCard}`}>
              <h3 className={styles.chartTitle}>Top countries</h3>
              <ChartFrame>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ff7a59" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartFrame>
            </div>

            <div className={`${styles.card} ${styles.chartCard}`}>
              <h3 className={styles.chartTitle}>Top pages</h3>
              <ChartFrame>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paths} layout="vertical" margin={{ left: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#111318" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartFrame>
            </div>
          </div>

          <div className={`${styles.card} ${styles.chartCard}`}>
            <h3 className={styles.chartTitle}>Top referrers</h3>
            <ChartFrame>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referrers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#eb3514" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
          </div>
        </>
      ) : (
        <div className={styles.card}>
          <p className={styles.muted}>Loading charts…</p>
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>When</th>
              <th>Page path</th>
              <th>Country</th>
              <th>Location</th>
              <th>IPv4</th>
              <th>Browser</th>
              <th>OS / Device</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  <code className={styles.monoPath}>{r.path}</code>
                </td>
                <td>{r.country || "—"}</td>
                <td>{r.location || [r.city, r.region, r.country].filter(Boolean).join(", ") || "—"}</td>
                <td>
                  <code className={styles.monoPath}>{r.ip || "—"}</code>
                </td>
                <td>{r.browser || "—"}</td>
                <td>
                  <span>{r.os || "—"}</span>
                  <span className={styles.muted} style={{ display: "block", fontSize: "0.78rem" }}>
                    {r.device}
                  </span>
                </td>
              </tr>
            ))}
            {!data.recent.length ? (
              <tr>
                <td colSpan={7} className={styles.muted}>
                  No visits in DB yet. Open <a href="/" target="_blank" rel="noreferrer">the homepage</a> in a new tab,
                  then come back — it should appear within 15s.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
