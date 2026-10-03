import type { Metadata } from "next";
import { Site } from "@/site/Site";
import { siteFontClass } from "@/site/fonts";
import { loadLanding, loadExperiences } from "@/site/cms/load";
import { getProjectsAsync } from "@/site/projects-db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const landing = await loadLanding();
  return {
    title: `${landing.site.name} — ${landing.site.roleTitle}`,
    description: landing.hero.lead,
    icons: {
      icon: [{ url: "/v2/fav-icon.png", type: "image/png" }],
      apple: [{ url: "/v2/fav-icon.png", type: "image/png" }],
    },
  };
}

export default async function HomePage() {
  const [landing, projects, experiences] = await Promise.all([
    loadLanding(),
    getProjectsAsync(),
    loadExperiences(),
  ]);

  return (
    <div className={siteFontClass}>
      <Site landing={landing} projects={projects} experiences={experiences} />
    </div>
  );
}
