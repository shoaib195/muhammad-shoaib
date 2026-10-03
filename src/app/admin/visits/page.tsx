import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminShell } from "@/admin/AdminShell";
import { VisitHistory } from "@/admin/VisitHistory";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Visit history — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminVisitsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell
      email={session.email}
      title="Visit history"
      subtitle="Searchable visitor log with pagination"
    >
      <VisitHistory />
    </AdminShell>
  );
}
