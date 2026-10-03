import type { Metadata } from "next";
import { SiteShell } from "@/site/Site";
import { WorkPage } from "@/site/WorkPage";
import { siteFontClass } from "@/site/fonts";
import { loadLanding } from "@/site/cms/load";
import { getProjectsAsync } from "@/site/projects-db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work — Muhammad Shoaib",
  description:
    "Selected projects by Muhammad Shoaib: CRM platforms, React Native apps, AI-assisted workflows, dashboards and storefronts shipped for real teams.",
  icons: {
    icon: [{ url: "/v2/fav-icon.png", type: "image/png" }],
    apple: [{ url: "/v2/fav-icon.png", type: "image/png" }],
  },
};

export default async function Work() {
  const [landing, projects] = await Promise.all([loadLanding(), getProjectsAsync()]);

  return (
    <div className={siteFontClass}>
      <SiteShell landing={landing} projects={projects} experiences={[]}>
        <WorkPage />
      </SiteShell>
    </div>
  );
}
