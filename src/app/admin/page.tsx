import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { AdminShell } from "@/admin/AdminShell";
import { DashboardHome } from "@/admin/DashboardHome";
import styles from "@/admin/admin.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell
      email={session.email}
      title="Dashboard"
      subtitle="Traffic pulse, top projects and latest leads"
      actions={
        <Link href="/admin/visits" className={`${styles.btn} ${styles.btnDark}`}>
          Visit history
        </Link>
      }
    >
      <DashboardHome />
    </AdminShell>
  );
}
