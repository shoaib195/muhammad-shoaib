import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { detectBrowser, detectOs, formatLocation, normalizeIp } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

function buildWhere(opts: { q?: string; country?: string; days?: number }): Prisma.PageVisitWhereInput {
  const q = (opts.q || "").trim().slice(0, 120);
  const country = (opts.country || "").trim().slice(0, 80);
  const days = Math.min(90, Math.max(1, Number(opts.days || 30)));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const where: Prisma.PageVisitWhereInput = {
    createdAt: { gte: since },
  };

  if (country && country !== "all") {
    where.country = { equals: country, mode: "insensitive" };
  }

  if (q) {
    where.OR = [
      { path: { contains: q, mode: "insensitive" } },
      { ip: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { region: { contains: q, mode: "insensitive" } },
      { browser: { contains: q, mode: "insensitive" } },
      { os: { contains: q, mode: "insensitive" } },
      { country: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function GET(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(50, Math.max(10, Number(searchParams.get("pageSize") || 20)));
  const q = searchParams.get("q") || "";
  const country = searchParams.get("country") || "all";
  const days = Number(searchParams.get("days") || 30);
  const where = buildWhere({ q, country, days });

  const [total, rows, countries] = await Promise.all([
    prisma.pageVisit.count({ where }),
    prisma.pageVisit.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        path: true,
        ip: true,
        country: true,
        city: true,
        region: true,
        address: true,
        isp: true,
        latitude: true,
        longitude: true,
        accuracy: true,
        locationSource: true,
        browser: true,
        os: true,
        device: true,
        userAgent: true,
        referrer: true,
        createdAt: true,
      },
    }),
    prisma.pageVisit.groupBy({
      by: ["country"],
      where: {
        createdAt: { gte: new Date(Date.now() - Math.min(90, Math.max(1, days)) * 24 * 60 * 60 * 1000) },
        NOT: { country: "" },
      },
      _count: { _all: true },
      orderBy: { _count: { country: "desc" } },
      take: 40,
    }),
  ]);

  const visits = rows.map((r) => {
    const ua = r.userAgent || "";
    const location = formatLocation({
      address: r.address,
      city: r.city,
      region: r.region,
      country: r.country,
    });
    return {
      id: r.id,
      path: r.path,
      ip: normalizeIp(r.ip) || r.ip || "—",
      country: r.country || "Unknown",
      city: r.city || "",
      region: r.region || "",
      address: r.address || "",
      isp: r.isp || "",
      latitude: r.latitude,
      longitude: r.longitude,
      accuracy: r.accuracy,
      locationSource: r.locationSource || "ip",
      location,
      mapsUrl:
        typeof r.latitude === "number" && typeof r.longitude === "number"
          ? `https://www.google.com/maps?q=${r.latitude},${r.longitude}`
          : "",
      browser: r.browser || detectBrowser(ua),
      os: r.os || detectOs(ua),
      device: r.device || "desktop",
      referrer: r.referrer,
      createdAt: r.createdAt,
    };
  });

  return NextResponse.json({
    ok: true,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    countries: countries.map((c) => c.country).filter(Boolean),
    visits,
  });
}

const deleteSchema = z.object({
  ids: z.array(z.string().min(1)).max(500).optional(),
  allMatching: z.boolean().optional(),
  q: z.string().max(120).optional(),
  country: z.string().max(80).optional(),
  days: z.number().int().min(1).max(90).optional(),
});

export async function DELETE(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });

  const parsed = deleteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid delete request" }, { status: 422 });
  }

  const { ids, allMatching } = parsed.data;

  if (allMatching) {
    const where = buildWhere({
      q: parsed.data.q,
      country: parsed.data.country || "all",
      days: parsed.data.days || 30,
    });
    const result = await prisma.pageVisit.deleteMany({ where });
    return NextResponse.json({ ok: true, deleted: result.count });
  }

  if (ids?.length) {
    const result = await prisma.pageVisit.deleteMany({
      where: { id: { in: ids } },
    });
    return NextResponse.json({ ok: true, deleted: result.count });
  }

  return NextResponse.json({ ok: false, error: "Provide ids or allMatching" }, { status: 422 });
}
