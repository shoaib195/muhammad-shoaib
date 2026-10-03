import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminShell } from "@/admin/AdminShell";
import { LandingEditor } from "@/admin/LandingEditor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Landing CMS — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLandingPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell
      email={session.email}
      title="Landing page"
      subtitle="Edit every public homepage section. Saves update Neon and the live site."
    >
      <LandingEditor email={session.email} />
    </AdminShell>
  );
}
