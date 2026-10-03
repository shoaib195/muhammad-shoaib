import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { detectBrowser, detectOs, formatLocation, normalizeIp } from "@/lib/analytics";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildSeries(days: number, rows: { createdAt: Date }[]) {
  const dayMap = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of rows) {
    const key = row.createdAt.toISOString().slice(0, 10);
    if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) || 0) + 1);
  }
  return Array.from(dayMap.entries()).map(([date, visits]) => ({ date, visits }));
}

export async function GET(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = Math.min(90, Math.max(7, Number(searchParams.get("days") || 30)));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const today = startOfDay();
  const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const includeRecent = searchParams.get("recent") === "1";

  const [
    total,
    todayCount,
    weekCount,
    sessions,
    byCountry,
    byPath,
    byDevice,
    byBrowser,
    byReferrer,
    seriesRaw,
    weekRaw,
    messages,
    unread,
    replied,
    projects,
    publishedProjects,
    experiences,
    recentLeads,
    projectRows,
  ] = await Promise.all([
    prisma.pageVisit.count(),
    prisma.pageVisit.count({ where: { createdAt: { gte: today } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: week } } }),
    prisma.pageVisit.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: since }, NOT: { sessionId: "" } },
    }),
    prisma.pageVisit.groupBy({
      by: ["country"],
      where: { createdAt: { gte: since }, NOT: { country: "" } },
      _count: { _all: true },
      orderBy: { _count: { country: "desc" } },
      take: 12,
    }),
    prisma.pageVisit.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 12,
    }),
    prisma.pageVisit.groupBy({
      by: ["device"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.pageVisit.groupBy({
      by: ["browser"],
      where: { createdAt: { gte: since }, NOT: { browser: "" } },
      _count: { _all: true },
      orderBy: { _count: { browser: "desc" } },
      take: 8,
    }),
    prisma.pageVisit.groupBy({
      by: ["referrer"],
      where: { createdAt: { gte: since }, NOT: { referrer: "" } },
      _count: { _all: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 8,
    }),
    prisma.pageVisit.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.pageVisit.findMany({
      where: { createdAt: { gte: week } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.count({ where: { repliedAt: { not: null } } }),
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.experience.count(),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        details: true,
        projectType: true,
        read: true,
        repliedAt: true,
        createdAt: true,
      },
    }),
    prisma.project.findMany({
      select: { id: true, name: true, cover: true, published: true },
    }),
  ]);

  const uniqueIps = await prisma.pageVisit.groupBy({
    by: ["ip"],
    where: { createdAt: { gte: since }, NOT: { ip: "" } },
  });

  const projectMap = new Map(projectRows.map((p) => [p.id, p]));
  const projectHits = new Map<string, number>();
  for (const row of byPath) {
    const m = row.path.match(/^\/work\/([^/?#]+)/);
    if (!m) continue;
    const id = m[1];
    projectHits.set(id, (projectHits.get(id) || 0) + row._count._all);
  }

  const topProjects = Array.from(projectHits.entries())
    .map(([id, visits]) => {
      const p = projectMap.get(id);
      return {
        id,
        name: p?.name || id,
        cover: p?.cover || "",
        published: p?.published ?? false,
        visits,
      };
    })
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  // If no /work hits yet, fall back to published projects list
  const topProjectsOut =
    topProjects.length > 0
      ? topProjects
      : projectRows
          .filter((p) => p.published)
          .slice(0, 5)
          .map((p) => ({ id: p.id, name: p.name, cover: p.cover, published: p.published, visits: 0 }));

  let recent: unknown[] = [];
  if (includeRecent) {
    const rows = await prisma.pageVisit.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        path: true,
        ip: true,
        country: true,
        city: true,
        region: true,
        address: true,
        browser: true,
        os: true,
        device: true,
        userAgent: true,
        referrer: true,
        createdAt: true,
      },
    });
    recent = rows.map((r) => {
      const ua = r.userAgent || "";
      return {
        id: r.id,
        path: r.path,
        ip: normalizeIp(r.ip) || r.ip || "—",
        country: r.country || "Unknown",
        city: r.city || "",
        region: r.region || "",
        location: formatLocation({
          address: r.address,
          city: r.city,
          region: r.region,
          country: r.country,
        }),
        browser: r.browser || detectBrowser(ua),
        os: r.os || detectOs(ua),
        device: r.device || "desktop",
        referrer: r.referrer,
        createdAt: r.createdAt,
      };
    });
  }

  return NextResponse.json({
    ok: true,
    stats: {
      totalVisits: total,
      todayVisits: todayCount,
      weekVisits: weekCount,
      uniqueSessions: sessions.length,
      uniqueIps: uniqueIps.length,
      messages,
      unread,
      replied,
      projects,
      publishedProjects,
      experiences,
      countriesTracked: byCountry.length,
      avgDaily: Math.round((weekCount / 7) * 10) / 10,
      days,
    },
    series: buildSeries(days, seriesRaw),
    weekSeries: buildSeries(7, weekRaw),
    countries: byCountry.map((c) => ({ name: c.country || "Unknown", value: c._count._all })),
    paths: byPath.map((p) => ({ name: p.path, value: p._count._all })),
    devices: byDevice.map((d) => ({ name: d.device || "desktop", value: d._count._all })),
    browsers: byBrowser.map((b) => ({ name: b.browser || "Other", value: b._count._all })),
    referrers: byReferrer.map((r) => ({
      name: r.referrer.replace(/^https?:\/\//, "").slice(0, 40) || "direct",
      value: r._count._all,
    })),
    topProjects: topProjectsOut,
    recentLeads: recentLeads.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      preview: m.details.slice(0, 90),
      projectType: m.projectType,
      read: m.read,
      replied: Boolean(m.repliedAt),
      createdAt: m.createdAt,
    })),
    recent,
  });
}
