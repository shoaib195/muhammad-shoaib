import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminShell } from "@/admin/AdminShell";
import { DashboardAnalytics } from "@/admin/DashboardAnalytics";

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
      subtitle="Country, IPv4, browser, OS/device, and page path. Exclude your own tests in Settings."
    >
      <DashboardAnalytics />
    </AdminShell>
  );
}
