"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/admin/AdminShell";
import { AdminButton } from "@/admin/AdminButton";
import { ImageUpload, MultiImageUpload } from "@/admin/ImageUpload";
import { SkeletonCard, SkeletonTable } from "@/admin/Skeleton";
import styles from "@/admin/admin.module.css";

type Project = {
  id: string;
  name: string;
  tagline: string;
  overview: string;
  what?: string;
  platform: string;
  tech: string[];
  role?: string[];
  features?: string[];
  liveUrl?: string | null;
  status?: string | null;
  published: boolean;
  sortOrder: number;
  category: string;
  challenge: string;
  period: string;
  company: string;
  cover: string;
  images: string[];
};

const empty: Project = {
  id: "",
  name: "",
  tagline: "",
  overview: "",
  what: "",
  platform: "Web",
  tech: [],
  role: [],
  features: [],
  liveUrl: "",
  status: "Shipped",
  published: true,
  sortOrder: 0,
  category: "",
  challenge: "",
  period: "",
  company: "",
  cover: "",
  images: [],
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(empty);
  const [originalId, setOriginalId] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [me, list] = await Promise.all([
        fetch("/api/admin/me").then((r) => r.json()),
        fetch("/api/admin/projects").then((r) => r.json()),
      ]);
      if (me.email) setEmail(me.email);
      if (list.projects) setProjects(list.projects);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p: Project) {
    setForm({ ...p, liveUrl: p.liveUrl || "", images: p.images || [] });
    setOriginalId(p.id);
    setEditing(true);
    setError("");
  }

  function startCreate() {
    setForm(empty);
    setOriginalId("");
    setEditing(false);
    setError("");
  }

  function lines(value: string[] | string | undefined) {
    if (Array.isArray(value)) return value;
    return String(value || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        previousId: editing ? originalId : undefined,
        tech: typeof form.tech === "string" ? String(form.tech).split(",").map((t) => t.trim()).filter(Boolean) : form.tech,
        liveUrl: form.liveUrl || null,
        images: form.images?.length ? form.images : form.cover ? [form.cover] : [],
        role: lines(form.role),
        features: lines(form.features),
        what: form.what || form.overview,
      };
      const res = await fetch("/api/admin/projects", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed — check slug/id and required fields.");
        return;
      }
      setForm(empty);
      setOriginalId("");
      setEditing(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(`Delete project "${id}"?`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      await load();
    } finally {
      setDeletingId("");
    }
  }

  return (
    <AdminShell
      email={email}
      title="Projects"
      subtitle="Main cover + slider images, publish to the live work grid"
      actions={
        <AdminButton variant="primary" onClick={startCreate}>
          New project
        </AdminButton>
      }
    >
      {loading ? (
        <>
          <div className={styles.grid}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonTable rows={4} />
        </>
      ) : (
        <div className={styles.panel}>
          <form className={`${styles.card} ${styles.form} ${styles.formWide}`} onSubmit={onSubmit}>
            <p className={styles.itemCardTitle}>{editing ? "Edit project" : "Create project"}</p>
            <div className={styles.fieldGrid}>
              <label className={styles.label}>
                Slug / URL id
                <input
                  className={styles.input}
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                  placeholder="oliv"
                  required
                />
              </label>
              <label className={styles.label}>
                Title
                <input className={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
            </div>
            {editing && originalId && originalId !== form.id ? (
              <p className={styles.muted}>URL will change from /work/{originalId} → /work/{form.id}</p>
            ) : null}
            <label className={styles.label}>
              Tagline
              <input className={styles.input} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </label>
            <label className={styles.label}>
              Description
              <textarea className={styles.textarea} value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} required />
            </label>
            <div className={styles.fieldGrid}>
              <label className={styles.label}>
                Challenge
                <textarea className={styles.textarea} value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} />
              </label>
              <label className={styles.label}>
                What we built
                <textarea className={styles.textarea} value={form.what || ""} onChange={(e) => setForm({ ...form, what: e.target.value })} />
              </label>
            </div>
            <label className={styles.label}>
              Features (one per line)
              <textarea
                className={styles.textarea}
                value={Array.isArray(form.features) ? form.features.join("\n") : form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value.split("\n") as unknown as string[] })}
              />
            </label>
            <label className={styles.label}>
              My role (one per line)
              <textarea
                className={styles.textarea}
                value={Array.isArray(form.role) ? form.role.join("\n") : form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value.split("\n") as unknown as string[] })}
              />
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
            <div className={styles.fieldGrid}>
              <label className={styles.label}>
                Project link
                <input className={styles.input} value={form.liveUrl || ""} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." />
              </label>
              <label className={styles.label}>
                Platform
                <select className={styles.select} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                  <option>Web</option>
                  <option>Mobile</option>
                  <option>Web · Mobile</option>
                </select>
              </label>
              <label className={styles.label}>
                Status
                <select className={styles.select} value={form.status || ""} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Shipped">Shipped</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Currently building">Currently building</option>
                </select>
              </label>
              <label className={styles.label}>
                Published
                <select
                  className={styles.select}
                  value={form.published ? "yes" : "no"}
                  onChange={(e) => setForm({ ...form, published: e.target.value === "yes" })}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
            </div>

            <ImageUpload
              label="Main image (cover)"
              value={form.cover}
              folder="projects"
              hint="Used on home showcase and work cards"
              onChange={(cover) => setForm({ ...form, cover })}
            />
            <MultiImageUpload
              label="Slider images"
              values={form.images || []}
              folder="projects"
              hint="Gallery images shown on the project detail page"
              onChange={(images) => setForm({ ...form, images })}
            />

            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.row}>
              <AdminButton type="submit" variant="primary" loading={saving}>
                {editing ? "Update project" : "Create project"}
              </AdminButton>
              {editing ? (
                <AdminButton onClick={startCreate}>Cancel</AdminButton>
              ) : null}
            </div>
          </form>

          <div className={styles.grid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {projects.map((p) => (
              <div key={p.id} className={`${styles.card} ${styles.projectCard}`}>
                <div className={styles.uploadPreview} style={{ width: "100%", aspectRatio: "16 / 10" }}>
                  {p.cover ? (
                    <Image src={p.cover} alt="" fill sizes="320px" className={styles.uploadImg} unoptimized />
                  ) : (
                    <span className={styles.uploadEmpty}>—</span>
                  )}
                </div>
                <div>
                  <strong>{p.name}</strong>
                  <p className={styles.muted} style={{ margin: "0.2rem 0 0" }}>
                    /work/{p.id} · {p.platform}
                  </p>
                  {(p.images?.length || 0) > 0 ? <span className={styles.badge}>{p.images.length} slider</span> : null}
                </div>
                <div className={styles.row}>
                  <AdminButton onClick={() => startEdit(p)}>Edit</AdminButton>
                  <AdminButton variant="danger" loading={deletingId === p.id} onClick={() => remove(p.id)}>
                    Delete
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
          {!projects.length ? <p className={styles.muted}>No projects yet.</p> : null}
        </div>
      )}
    </AdminShell>
  );
}
