import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/site/Site";
import { ProjectDetail } from "@/site/ProjectDetail";
import { getProject, getProjectIds } from "@/site/projects";
import { siteFontClass } from "@/site/fonts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjectIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
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
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className={siteFontClass}>
      <SiteShell>
        <ProjectDetail project={project} />
      </SiteShell>
    </div>
  );
}
