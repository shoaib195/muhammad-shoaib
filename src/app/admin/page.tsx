import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminShell } from "@/admin/AdminShell";
import styles from "@/admin/admin.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Muhammad Shoaib",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let projects = 0;
  let experiences = 0;
  let messages = 0;
  let unread = 0;
  let dbError = "";

  try {
    [projects, experiences, messages, unread] = await Promise.all([
      prisma.project.count(),
      prisma.experience.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);
  } catch {
    dbError = "Database not connected. Add DATABASE_URL to .env and run npm run db:setup.";
  }

  const total = Math.max(projects + experiences + messages, 1);
  const health = Math.min(100, Math.round(((projects + experiences) / total) * 100));

  return (
    <AdminShell
      email={session.email}
      title="Dashboard"
      welcome
      metrics={[
        { label: "Projects", value: projects },
        { label: "Experience", value: experiences },
        { label: "Messages", value: messages },
      ]}
    >
      {dbError ? <p className={styles.error}>{dbError}</p> : null}

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.cardAccent}`}>
          <p className={styles.cardLabel}>Unread inbox</p>
          <p className={styles.cardValue}>{unread}</p>
          <div className={styles.progressRail}>
            <div className={styles.progressFill} style={{ width: `${messages ? (unread / messages) * 100 : 0}%` }} />
          </div>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Content health</p>
          <p className={styles.cardValue}>{health}%</p>
          <div className={styles.progressRail}>
            <div className={styles.progressFill} style={{ width: `${health}%` }} />
          </div>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Published work</p>
          <p className={styles.cardValue}>{projects}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Roles</p>
          <p className={styles.cardValue}>{experiences}</p>
        </div>
      </div>

      <div className={styles.row} style={{ marginTop: "0.35rem" }}>
        <Link href="/admin/landing" className={`${styles.btn} ${styles.btnPrimary}`}>
          Customize landing
        </Link>
        <Link href="/admin/projects" className={`${styles.btn} ${styles.btnDark}`}>
          Manage projects
        </Link>
        <Link href="/admin/experience" className={styles.btn}>
          Experience
        </Link>
        <Link href="/admin/messages" className={styles.btn}>
          Messages
        </Link>
      </div>
    </AdminShell>
  );
}
