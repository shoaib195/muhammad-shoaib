"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/admin/AdminShell";
import styles from "@/admin/admin.module.css";

type Project = {
  id: string;
  name: string;
  tagline: string;
  overview: string;
  platform: string;
  tech: string[];
  liveUrl?: string | null;
  status?: string | null;
  published: boolean;
  sortOrder: number;
  category: string;
  challenge: string;
  period: string;
  company: string;
  cover: string;
};

const empty: Project = {
  id: "",
  name: "",
  tagline: "",
  overview: "",
  platform: "Web",
  tech: [],
  liveUrl: "",
  status: "Shipped",
  published: true,
  sortOrder: 0,
  category: "",
  challenge: "",
  period: "",
  company: "",
  cover: "/v2/w1.jpg",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(empty);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  async function load() {
    const [me, list] = await Promise.all([
      fetch("/api/admin/me").then((r) => r.json()),
      fetch("/api/admin/projects").then((r) => r.json()),
    ]);
    if (me.email) setEmail(me.email);
    if (list.projects) setProjects(list.projects);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p: Project) {
    setForm({ ...p, liveUrl: p.liveUrl || "" });
    setEditing(true);
    setError("");
  }

  function startCreate() {
    setForm(empty);
    setEditing(false);
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      tech: typeof form.tech === "string" ? String(form.tech).split(",").map((t) => t.trim()).filter(Boolean) : form.tech,
      liveUrl: form.liveUrl || null,
      images: form.cover ? [form.cover] : [],
      role: [],
      features: [],
      impact: [],
      what: form.overview,
    };
    const res = await fetch("/api/admin/projects", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError("Save failed — check slug/id and required fields.");
      return;
    }
    setForm(empty);
    setEditing(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm(`Delete project "${id}"?`)) return;
    await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell email={email} title="Projects" subtitle="Create, edit, and publish portfolio projects">
      <div className={styles.row} style={{ marginBottom: "1rem" }}>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={startCreate}>
          New project
        </button>
      </div>

      <form className={styles.form} onSubmit={onSubmit} style={{ marginBottom: "1.5rem" }}>
        <label className={styles.label}>
          Slug / ID {editing ? "(locked)" : ""}
          <input
            className={styles.input}
            value={form.id}
            disabled={editing}
            onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
            placeholder="crm-admin"
            required
          />
        </label>
        <label className={styles.label}>
          Title
          <input className={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className={styles.label}>
          Description
          <textarea className={styles.textarea} value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} required />
        </label>
        <label className={styles.label}>
          Tech stack (comma separated)
          <input
            className={styles.input}
            value={Array.isArray(form.tech) ? form.tech.join(", ") : form.tech}
            onChange={(e) => setForm({ ...form, tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) as unknown as string[] })}
            placeholder="React, Next.js, TypeScript"
          />
        </label>
        <label className={styles.label}>
          Project link
          <input className={styles.input} value={form.liveUrl || ""} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." />
        </label>
        <div className={styles.row}>
          <label className={styles.label} style={{ flex: 1 }}>
            Platform
            <select className={styles.select} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
              <option>Web</option>
              <option>Mobile</option>
              <option>Web · Mobile</option>
            </select>
          </label>
          <label className={styles.label} style={{ flex: 1 }}>
            Status
            <select className={styles.select} value={form.status || ""} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Shipped">Shipped</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Currently building">Currently building</option>
            </select>
          </label>
        </div>
        <label className={styles.label}>
          Cover image path
          <input className={styles.input} value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} />
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.row}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            {editing ? "Update project" : "Create project"}
          </button>
          {editing ? (
            <button type="button" className={styles.btn} onClick={startCreate}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Platform</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.name}</strong>
                  <div className={styles.muted}>{p.id}</div>
                </td>
                <td>{p.platform}</td>
                <td>{p.status || "—"}</td>
                <td>
                  <div className={styles.row}>
                    <button type="button" className={styles.btn} onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => remove(p.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
