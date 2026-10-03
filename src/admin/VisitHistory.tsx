"use client";

import { useEffect, useMemo, useState } from "react";
import { SkeletonCard } from "@/admin/Skeleton";
import styles from "@/admin/admin.module.css";

type Visit = {
  id: string;
  path: string;
  ip: string;
  country: string;
  location?: string;
  address?: string;
  isp?: string;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  locationSource?: string;
  mapsUrl?: string;
  browser?: string;
  os?: string;
  device: string;
  createdAt: string;
};

export function VisitHistory() {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [days, setDays] = useState(30);
  const [page, setPage] = useState(1);
  const [countries, setCountries] = useState<string[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setQuery(q.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    async function load() {
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: "20",
          days: String(days),
          country,
        });
        if (query) params.set("q", query);
        const res = await fetch(`/api/admin/visits?${params}`);
        const json = await res.json();
        if (!alive) return;
        if (!json.ok) {
          setError("Could not load visits.");
          return;
        }
        setVisits(json.visits || []);
        setTotal(json.total || 0);
        setTotalPages(json.totalPages || 1);
        setCountries(json.countries || []);
        setSelected(new Set());
        setError("");
      } catch {
        if (alive) setError("Network error loading visits.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [page, query, country, days, reloadKey]);

  const pageIds = useMemo(() => visits.map((v) => v.id), [visits]);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllOnPage() {
    setSelected((prev) => {
      if (allOnPageSelected) return new Set();
      return new Set(pageIds);
    });
  }

  async function deleteIds(ids: string[]) {
    if (!ids.length) return;
    const label = ids.length === 1 ? "this visit" : `${ids.length} selected visits`;
    if (!confirm(`Delete ${label} from the database? This cannot be undone.`)) return;

    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/visits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Delete failed");
        return;
      }
      setMsg(`Deleted ${data.deleted ?? ids.length} visit(s) from database.`);
      setReloadKey((k) => k + 1);
    } catch {
      setError("Network error while deleting.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAllMatching() {
    if (!total) return;
    if (
      !confirm(
        `Delete ALL ${total} visit(s) matching the current filters from the database? This cannot be undone.`,
      )
    ) {
      return;
    }

    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/visits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allMatching: true,
          q: query,
          country,
          days,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Delete failed");
        return;
      }
      setMsg(`Deleted ${data.deleted ?? 0} visit(s) from database.`);
      setPage(1);
      setReloadKey((k) => k + 1);
    } catch {
      setError("Network error while deleting.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <div className={styles.filterGroup} style={{ flex: 1 }}>
          <input
            className={`${styles.input} ${styles.searchInput}`}
            placeholder="Search path, IP, city, browser, OS…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search visits"
          />
          <select
            className={styles.select}
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by country"
          >
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            value={days}
            onChange={(e) => {
              setDays(Number(e.target.value));
              setPage(1);
            }}
            aria-label="Date range"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
        <p className={styles.muted} style={{ margin: 0 }}>
          {total} result{total === 1 ? "" : "s"}
        </p>
      </div>

      <p className={styles.muted} style={{ margin: 0 }}>
        Auto-detected from visitor IP (ipwho.is) — country, city, region, approximate coordinates, ISP. No browser
        permission needed. Exact house/street GPS is not available without the visitor manually sharing location.
      </p>

      <div className={styles.toolbar}>
        <div className={styles.toolbarActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            disabled={!someSelected || busy}
            onClick={() => deleteIds(Array.from(selected))}
          >
            Delete selected ({selected.size})
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            disabled={!total || busy}
            onClick={deleteAllMatching}
          >
            Delete all matching
          </button>
        </div>
      </div>

      {msg ? <p className={styles.toast}>{msg}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      {loading && !visits.length ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkCol}>
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleAllOnPage}
                    disabled={!visits.length || busy}
                    aria-label="Select all on this page"
                  />
                </th>
                <th>When</th>
                <th>Page path</th>
                <th>Country</th>
                <th>Address / Location</th>
                <th>IPv4</th>
                <th>ISP</th>
                <th>Browser</th>
                <th>OS / Device</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((r) => (
                <tr key={r.id} className={selected.has(r.id) ? styles.rowSelected : undefined}>
                  <td className={styles.checkCol}>
                    <input
                      type="checkbox"
                      checked={selected.has(r.id)}
                      onChange={() => toggleOne(r.id)}
                      disabled={busy}
                      aria-label={`Select visit ${r.path}`}
                    />
                  </td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td>
                    <code className={styles.monoPath}>{r.path}</code>
                  </td>
                  <td>{r.country || "—"}</td>
                  <td style={{ maxWidth: "18rem" }}>
                    <span>{r.address || r.location || "—"}</span>
                    <span className={styles.muted} style={{ display: "block", fontSize: "0.78rem" }}>
                      {r.locationSource === "gps" ? "GPS + reverse geocode" : "IP approximate"}
                      {typeof r.accuracy === "number" ? ` · ±${Math.round(r.accuracy)}m` : ""}
                    </span>
                    {r.mapsUrl ? (
                      <a href={r.mapsUrl} target="_blank" rel="noreferrer" className={styles.textLink}>
                        Open map
                      </a>
                    ) : null}
                  </td>
                  <td>
                    <code className={styles.monoPath}>{r.ip || "—"}</code>
                  </td>
                  <td>{r.isp || "—"}</td>
                  <td>{r.browser || "—"}</td>
                  <td>
                    <span>{r.os || "—"}</span>
                    <span className={styles.muted} style={{ display: "block", fontSize: "0.78rem" }}>
                      {r.device}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                      disabled={busy}
                      onClick={() => deleteIds([r.id])}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!visits.length ? (
                <tr>
                  <td colSpan={10} className={styles.muted}>
                    No visits match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.btn}
          disabled={page <= 1 || loading || busy}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className={styles.muted}>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className={styles.btn}
          disabled={page >= totalPages || loading || busy}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
