import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/site/Site";
import { ProjectDetail } from "@/site/ProjectDetail";
import { getProjectAsync, getProjectIdsAsync } from "@/site/projects-db";
import { siteFontClass } from "@/site/fonts";
import { loadLanding } from "@/site/cms/load";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const ids = await getProjectIdsAsync();
  return ids.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectAsync(slug);
  if (!project) return { title: "Project — Muhammad Shoaib" };

  return {
    title: `${project.name} — Muhammad Shoaib`,
    description: project.overview,
    icons: {
      icon: [{ url: "/v2/fav-icon.png", type: "image/png" }],
      apple: [{ url: "/v2/fav-icon.png", type: "image/png" }],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, landing] = await Promise.all([getProjectAsync(slug), loadLanding()]);
  if (!project) notFound();

  return (
    <div className={siteFontClass}>
      <SiteShell landing={landing} projects={[]} experiences={[]}>
        <ProjectDetail project={project} />
      </SiteShell>
    </div>
  );
}
