"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/admin/AdminShell";
import { AdminButton } from "@/admin/AdminButton";
import { SkeletonTable } from "@/admin/Skeleton";
import styles from "@/admin/admin.module.css";

type Exp = {
  id?: string;
  role: string;
  company: string;
  years: string;
  summary: string;
  highlights: string[];
  stack: string[];
  outcomes: string[];
  sortOrder: number;
};

const empty: Exp = {
  role: "",
  company: "",
  years: "",
  summary: "",
  highlights: [],
  stack: [],
  outcomes: [],
  sortOrder: 0,
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Exp[]>([]);
  const [form, setForm] = useState<Exp>(empty);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [me, list] = await Promise.all([
        fetch("/api/admin/me").then((r) => r.json()),
        fetch("/api/admin/experiences").then((r) => r.json()),
      ]);
      if (me.email) setEmail(me.email);
      if (list.experiences) setItems(list.experiences);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights:
          typeof form.highlights === "string"
            ? String(form.highlights).split("\n").map((x) => x.trim()).filter(Boolean)
            : form.highlights,
        stack:
          typeof form.stack === "string"
            ? String(form.stack).split(",").map((x) => x.trim()).filter(Boolean)
            : form.stack,
        outcomes:
          typeof form.outcomes === "string"
            ? String(form.outcomes).split("\n").map((x) => x.trim()).filter(Boolean)
            : form.outcomes,
      };
      await fetch("/api/admin/experiences", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setForm(empty);
      setEditing(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this experience?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/experiences?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      await load();
    } finally {
      setDeletingId("");
    }
  }

  return (
    <AdminShell email={email} title="Experience" subtitle="Roles that ship on the public Experience section">
      {loading ? (
        <SkeletonTable rows={4} />
      ) : (
        <div className={styles.split}>
          <form className={`${styles.card} ${styles.form}`} onSubmit={onSubmit}>
            <p className={styles.itemCardTitle}>{editing ? "Edit role" : "Add role"}</p>
            <label className={styles.label}>
              Role
              <input className={styles.input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            </label>
            <label className={styles.label}>
              Company
              <input className={styles.input} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </label>
            <label className={styles.label}>
              Years
              <input className={styles.input} value={form.years} onChange={(e) => setForm({ ...form, years: e.target.value })} />
            </label>
            <label className={styles.label}>
              Summary
              <textarea className={styles.textarea} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </label>
            <label className={styles.label}>
              Highlights (one per line)
              <textarea
                className={styles.textarea}
                value={Array.isArray(form.highlights) ? form.highlights.join("\n") : form.highlights}
                onChange={(e) => setForm({ ...form, highlights: e.target.value.split("\n") as unknown as string[] })}
              />
            </label>
            <label className={styles.label}>
              Stack (comma separated)
              <input
                className={styles.input}
                value={Array.isArray(form.stack) ? form.stack.join(", ") : form.stack}
                onChange={(e) => setForm({ ...form, stack: e.target.value.split(",") as unknown as string[] })}
              />
            </label>
            <div className={styles.row}>
              <AdminButton type="submit" variant="primary" loading={saving}>
                {editing ? "Update" : "Add experience"}
              </AdminButton>
              {editing ? (
                <AdminButton
                  onClick={() => {
                    setForm(empty);
                    setEditing(false);
                  }}
                >
                  Cancel
                </AdminButton>
              ) : null}
            </div>
          </form>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Years</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.role}</td>
                    <td>{item.company}</td>
                    <td>{item.years}</td>
                    <td>
                      <div className={styles.row}>
                        <AdminButton
                          onClick={() => {
                            setForm(item);
                            setEditing(true);
                          }}
                        >
                          Edit
                        </AdminButton>
                        <AdminButton
                          variant="danger"
                          loading={deletingId === item.id}
                          onClick={() => item.id && remove(item.id)}
                        >
                          Delete
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
