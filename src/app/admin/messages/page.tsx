"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/admin/AdminShell";
import { AdminButton } from "@/admin/AdminButton";
import { SkeletonTable } from "@/admin/Skeleton";
import styles from "@/admin/admin.module.css";

type Reply = { id: string; body: string; createdAt: string; sentBy?: string | null };
type Msg = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  projectType?: string | null;
  details: string;
  read: boolean;
  repliedAt?: string | null;
  createdAt: string;
  replies?: Reply[];
};

export default function AdminMessagesPage() {
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Msg | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [me, list] = await Promise.all([
        fetch("/api/admin/me").then((r) => r.json()),
        fetch("/api/admin/messages").then((r) => r.json()),
      ]);
      if (me.email) setEmail(me.email);
      if (list.messages) {
        setMessages(list.messages);
        if (selected) {
          setSelected(list.messages.find((m: Msg) => m.id === selected.id) || null);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = window.setInterval(load, 20000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openMessage(m: Msg) {
    setSelected(m);
    setReply("");
    setMsg("");
    if (!m.read) {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id, read: true }),
      });
      await load();
    }
  }

  async function sendReply(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, body: reply }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.error || "Reply failed");
        return;
      }
      setReply("");
      setMsg(
        data.emailed
          ? "Reply emailed to the visitor and saved."
          : data.warning || "Reply saved in admin (SMTP email not delivered).",
      );
      await load();
    } catch {
      setMsg("Network error while sending reply. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setSelected(null);
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell email={email} title="Messages" subtitle="Contact form leads — reply directly from admin">
      {loading && !messages.length ? (
        <SkeletonTable rows={5} />
      ) : (
        <div className={styles.split}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Preview</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => openMessage(m)}
                    style={{ cursor: "pointer", opacity: m.read ? 0.75 : 1, background: selected?.id === m.id ? "#fff5f1" : undefined }}
                  >
                    <td>
                      <strong>{m.name}</strong>
                      <div className={styles.muted}>{m.email}</div>
                      {!m.read ? <span className={styles.badge}>Unread</span> : null}
                      {m.repliedAt ? <span className={styles.badge}>Replied</span> : null}
                    </td>
                    <td>{m.details.slice(0, 90)}{m.details.length > 90 ? "…" : ""}</td>
                    <td>{new Date(m.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {!messages.length ? (
                  <tr>
                    <td colSpan={3} className={styles.muted}>
                      No messages yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className={`${styles.card} ${styles.panel}`}>
            {!selected ? (
              <p className={styles.muted} style={{ margin: 0 }}>
                Select a message to read and reply.
              </p>
            ) : (
              <>
                <div>
                  <h2 className={styles.itemCardTitle}>{selected.name}</h2>
                  <p className={styles.muted}>
                    {selected.email}
                    {selected.company ? ` · ${selected.company}` : ""}
                    {selected.projectType ? ` · ${selected.projectType}` : ""}
                  </p>
                </div>
                <div className={styles.itemCard}>
                  <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{selected.details}</p>
                </div>

                {selected.replies?.length ? (
                  <div className={styles.panel}>
                    <p className={styles.cardLabel}>Previous replies</p>
                    {selected.replies.map((r) => (
                      <div key={r.id} className={styles.itemCard}>
                        <p className={styles.muted} style={{ margin: 0 }}>
                          {new Date(r.createdAt).toLocaleString()} {r.sentBy ? `· ${r.sentBy}` : ""}
                        </p>
                        <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{r.body}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <form className={styles.form} onSubmit={sendReply}>
                  <label className={styles.label}>
                    Reply to {selected.email}
                    <textarea
                      className={styles.textarea}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      required
                      placeholder="Write a professional reply…"
                    />
                  </label>
                  {msg ? <p className={styles.toast}>{msg}</p> : null}
                  <div className={styles.row}>
                    <AdminButton type="submit" variant="primary" loading={busy}>
                      Send reply
                    </AdminButton>
                    <AdminButton variant="danger" loading={busy} onClick={() => remove(selected.id)}>
                      Delete
                    </AdminButton>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
