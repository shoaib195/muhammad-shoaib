import type { Project } from "./projects";
import { projects as staticProjects, getProject as getStaticProject, getProjectIds as getStaticIds } from "./projects";

function mapDbProject(p: {
  id: string;
  name: string;
  tagline: string;
  category: string;
  challenge: string;
  platform: string;
  period: string;
  company: string;
  cover: string;
  images: string[];
  overview: string;
  what: string;
  role: string[];
  tech: string[];
  features: string[];
  impact: string[];
  liveUrl: string | null;
  sourceUrl: string | null;
  status: string | null;
}): Project {
  return {
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    category: p.category,
    challenge: p.challenge,
    platform: p.platform as Project["platform"],
    period: p.period,
    company: p.company,
    cover: p.cover,
    images: p.images,
    overview: p.overview,
    what: p.what,
    role: p.role,
    tech: p.tech,
    features: p.features,
    impact: p.impact,
    links: {
      live: p.liveUrl || undefined,
      source: p.sourceUrl || undefined,
    },
    status: (p.status as Project["status"]) || undefined,
  };
}

/** Load published projects from Neon when available; fall back to static data. */
export async function getProjectsAsync(): Promise<Project[]> {
  try {
    if (!process.env.DATABASE_URL) return staticProjects;
    const { prisma } = await import("@/lib/db");
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    if (!rows.length) return staticProjects;
    return rows.map(mapDbProject);
  } catch {
    return staticProjects;
  }
}

export async function getProjectAsync(id: string): Promise<Project | undefined> {
  try {
    if (!process.env.DATABASE_URL) return getStaticProject(id);
    const { prisma } = await import("@/lib/db");
    const row = await prisma.project.findFirst({ where: { id, published: true } });
    if (!row) return getStaticProject(id);
    return mapDbProject(row);
  } catch {
    return getStaticProject(id);
  }
}

export async function getProjectIdsAsync(): Promise<string[]> {
  try {
    if (!process.env.DATABASE_URL) return getStaticIds();
    const { prisma } = await import("@/lib/db");
    const rows = await prisma.project.findMany({
      where: { published: true },
      select: { id: true },
      orderBy: { sortOrder: "asc" },
    });
    if (!rows.length) return getStaticIds();
    return rows.map((r) => r.id);
  } catch {
    return getStaticIds();
  }
}
