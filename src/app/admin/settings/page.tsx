"use client";

import Link from "next/link";
import { AdminShell } from "@/admin/AdminShell";
import styles from "@/admin/admin.module.css";
import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((me) => {
        if (me.email) setEmail(me.email);
      });
  }, []);

  return (
    <AdminShell
      email={email}
      title="Settings"
      subtitle="Landing copy moved to the Landing CMS. Projects and experience have their own pages."
    >
      <div className={styles.card}>
        <p className={styles.muted} style={{ margin: 0 }}>
          Use <strong>Landing</strong> to edit the full homepage. Identity, hero, about, contact, process and more
          all save to the database and refresh the live site immediately.
        </p>
        <div className={styles.row} style={{ marginTop: "1rem" }}>
          <Link href="/admin/landing" className={`${styles.btn} ${styles.btnPrimary}`}>
            Open Landing CMS
          </Link>
          <Link href="/admin/projects" className={styles.btn}>
            Projects
          </Link>
          <Link href="/admin/experience" className={styles.btn}>
            Experience
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
