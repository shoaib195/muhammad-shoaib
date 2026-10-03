"use client";

import Link from "next/link";
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

type Payload = {
  stats: {
    totalVisits: number;
    todayVisits: number;
    weekVisits: number;
    uniqueSessions: number;
    uniqueIps: number;
    countriesTracked: number;
    avgDaily: number;
    unread: number;
    messages: number;
    days: number;
  };
  series: { date: string; visits: number }[];
  countries: { name: string; value: number }[];
  paths: { name: string; value: number }[];
  devices: { name: string; value: number }[];
  browsers: { name: string; value: number }[];
  referrers: { name: string; value: number }[];
};

const COLORS = ["#eb3514", "#ff7a59", "#111318", "#6b7280", "#f59e0b", "#22c55e"];
const DAY_OPTIONS = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

export function AnalyticsPanel() {
  const [days, setDays] = useState(30);
  const [chartView, setChartView] = useState<"traffic" | "audience" | "content">("traffic");
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    async function load() {
      try {
        const res = await fetch(`/api/admin/analytics?days=${days}`);
        const json = await res.json();
        if (!alive) return;
        if (json.ok) {
          setData(json);
          setError("");
        } else setError("Could not load analytics.");
      } catch {
        if (alive) setError("Network error loading analytics.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [days]);

  if (loading && !data) {
    return (
      <div className={styles.stats6}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!data) return <p className={styles.error}>{error || "Could not load analytics."}</p>;

  const { stats } = data;
  const series = data.series?.length ? data.series : [{ date: new Date().toISOString().slice(0, 10), visits: 0 }];
  const devices = data.devices?.length ? data.devices : [{ name: "none", value: 1 }];
  const browsers = data.browsers?.length ? data.browsers : [{ name: "—", value: 0 }];
  const countries = data.countries?.length ? data.countries : [{ name: "—", value: 0 }];
  const paths = data.paths?.length ? data.paths : [{ name: "—", value: 0 }];
  const referrers = data.referrers?.length ? data.referrers : [{ name: "—", value: 0 }];

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="days">
            Range
          </label>
          <select
            id="days"
            className={styles.select}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            {DAY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="view">
            View
          </label>
          <select
            id="view"
            className={styles.select}
            value={chartView}
            onChange={(e) => setChartView(e.target.value as typeof chartView)}
          >
            <option value="traffic">Traffic</option>
            <option value="audience">Audience</option>
            <option value="content">Pages & referrers</option>
          </select>
        </div>
        <div className={styles.toolbarActions}>
          <Link href="/admin/visits" className={styles.btn}>
            Visit history
          </Link>
          <Link href="/admin/settings" className={styles.btn}>
            Exclude self
          </Link>
        </div>
      </div>

      <div className={styles.stats6}>
        <div className={`${styles.card} ${styles.cardAccent}`}>
          <p className={styles.cardLabel}>Visits in range</p>
          <p className={styles.cardValue}>{series.reduce((n, d) => n + d.visits, 0)}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Today</p>
          <p className={styles.cardValue}>{stats.todayVisits}</p>
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
          <p className={styles.cardLabel}>Inbox</p>
          <p className={styles.cardValue}>{stats.unread}</p>
          <p className={styles.muted}>{stats.messages} total</p>
        </div>
      </div>

      {ready ? (
        <>
          {chartView === "traffic" ? (
            <div className={`${styles.card} ${styles.chartCard}`}>
              <h3 className={styles.chartTitle}>Visits ({days} days)</h3>
              <div className={styles.chartFrameTall}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series}>
                    <defs>
                      <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#eb3514" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#eb3514" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => String(v).slice(5)} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                    <Tooltip />
                    <Area type="monotone" dataKey="visits" stroke="#eb3514" fill="url(#analyticsFill)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}

          {chartView === "audience" ? (
            <div className={`${styles.charts} ${styles.charts3}`}>
              <div className={`${styles.card} ${styles.chartCard}`}>
                <h3 className={styles.chartTitle}>Devices</h3>
                <div className={styles.chartFrame}>
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
                </div>
              </div>
              <div className={`${styles.card} ${styles.chartCard}`}>
                <h3 className={styles.chartTitle}>Browsers</h3>
                <div className={styles.chartFrame}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={browsers}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ff7a59" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={`${styles.card} ${styles.chartCard}`}>
                <h3 className={styles.chartTitle}>Top countries</h3>
                <div className={styles.chartFrame}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#111318" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : null}

          {chartView === "content" ? (
            <div className={styles.charts}>
              <div className={`${styles.card} ${styles.chartCard}`}>
                <h3 className={styles.chartTitle}>Top pages</h3>
                <div className={styles.chartFrame}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paths} layout="vertical" margin={{ left: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#111318" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={`${styles.card} ${styles.chartCard}`}>
                <h3 className={styles.chartTitle}>Top referrers</h3>
                <div className={styles.chartFrame}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={referrers}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#eb3514" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className={styles.card}>
          <p className={styles.muted}>Loading charts…</p>
        </div>
      )}
    </div>
  );
}
