/** Client-safe merge (no Prisma import). */
import { defaultLanding } from "@/site/cms/defaults";
import type { LandingContent } from "@/site/cms/types";

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

export function mergeLanding(partial: unknown): LandingContent {
  if (!isObject(partial)) return structuredClone(defaultLanding);
  const base = structuredClone(defaultLanding);
  const merge = (target: Record<string, unknown>, source: Record<string, unknown>) => {
    for (const [k, v] of Object.entries(source)) {
      if (v === undefined || v === null) continue;
      if (Array.isArray(v)) {
        target[k] = v;
        continue;
      }
      if (isObject(v) && isObject(target[k])) {
        merge(target[k] as Record<string, unknown>, v);
      } else {
        target[k] = v;
      }
    }
  };
  merge(base as unknown as Record<string, unknown>, partial);
  return base;
}
