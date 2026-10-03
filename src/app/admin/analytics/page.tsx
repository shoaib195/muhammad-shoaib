import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { AdminShell } from "@/admin/AdminShell";
import { AnalyticsPanel } from "@/admin/AnalyticsPanel";
import styles from "@/admin/admin.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analytics — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell
      email={session.email}
      title="Analytics"
      subtitle="Filter traffic by range and view — exclude your own tests in Settings"
      actions={
        <Link href="/admin/visits" className={styles.btn}>
          Visit history
        </Link>
      }
    >
      <AnalyticsPanel />
    </AdminShell>
  );
}
