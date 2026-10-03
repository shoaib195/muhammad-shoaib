import { prisma } from "@/lib/db";
import { experience as staticExperience } from "../data";
import { experienceDetails } from "../content";
import { defaultLanding, LANDING_SETTING_KEY } from "./defaults";
import { mergeLanding } from "./load-client";
import type { ExperienceItem, LandingContent } from "./types";

export { mergeLanding } from "./load-client";

export async function loadLanding(): Promise<LandingContent> {
  if (!process.env.DATABASE_URL) return structuredClone(defaultLanding);
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: LANDING_SETTING_KEY } });
    if (!row?.value) return structuredClone(defaultLanding);
    return mergeLanding(row.value);
  } catch {
    return structuredClone(defaultLanding);
  }
}

export async function loadExperiences(): Promise<ExperienceItem[]> {
  if (!process.env.DATABASE_URL) return staticExperiences();
  try {
    const rows = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });
    if (!rows.length) return staticExperiences();
    return rows.map((r) => ({
      id: r.id,
      role: r.role,
      company: r.company,
      years: r.years,
      highlights: r.highlights,
      summary: r.summary,
      stack: r.stack,
      outcomes: r.outcomes,
      sortOrder: r.sortOrder,
    }));
  } catch {
    return staticExperiences();
  }
}

function staticExperiences(): ExperienceItem[] {
  return staticExperience.map((e, i) => {
    const details = experienceDetails[e.company];
    return {
      role: e.role,
      company: e.company,
      years: e.years,
      highlights: [...e.highlights],
      summary: details?.summary ?? "",
      stack: details?.stack ?? [],
      outcomes: details?.outcomes ?? [],
      sortOrder: i,
    };
  });
}
