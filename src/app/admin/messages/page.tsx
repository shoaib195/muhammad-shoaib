"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/admin/AdminShell";
import styles from "@/admin/admin.module.css";

type Msg = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  projectType?: string | null;
  details: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  async function load() {
    const [me, list] = await Promise.all([
      fetch("/api/admin/me").then((r) => r.json()),
      fetch("/api/admin/messages").then((r) => r.json()),
    ]);
    if (me.email) setEmail(me.email);
    if (list.messages) setMessages(list.messages);
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell email={email} title="Messages" subtitle="Contact form submissions">
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>From</th>
              <th>Details</th>
              <th>When</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id} style={{ opacity: m.read ? 0.7 : 1 }}>
                <td>
                  <strong>{m.name}</strong>
                  <div className={styles.muted}>{m.email}</div>
                  {m.company ? <div className={styles.muted}>{m.company}</div> : null}
                  {!m.read ? <span style={{ color: "#ff7a59", fontSize: "0.75rem" }}>Unread</span> : null}
                </td>
                <td>
                  {m.projectType ? <div className={styles.muted}>{m.projectType}</div> : null}
                  <div>{m.details}</div>
                </td>
                <td>{new Date(m.createdAt).toLocaleString()}</td>
                <td>
                  <div className={styles.row}>
                    {!m.read ? (
                      <button type="button" className={styles.btn} onClick={() => markRead(m.id)}>
                        Mark read
                      </button>
                    ) : null}
                    <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => remove(m.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {messages.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.muted}>
                  No messages yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
