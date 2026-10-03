import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  analyticsContextFromRequest,
  detectBrowser,
  detectDevice,
  detectOs,
  normalizeIp,
  resolveVisitLocation,
  shouldSkipAnalytics,
} from "@/lib/analytics";

export const runtime = "nodejs";

const schema = z.object({
  path: z.string().min(1).max(300),
  referrer: z.string().max(500).optional().default(""),
  sessionId: z.string().max(80).optional().default(""),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  accuracy: z.number().min(0).max(100000).optional().nullable(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 });

  const { ip: rawIp, cookieSkip, ua } = await analyticsContextFromRequest(req);
  const ip = normalizeIp(rawIp) || "127.0.0.1";
  const path = parsed.data.path.startsWith("/") ? parsed.data.path : `/${parsed.data.path}`;

  if (await shouldSkipAnalytics({ path, ip, cookieSkip })) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Light dedupe: same session + path within 2 minutes (avoid double-count on remount)
  if (parsed.data.sessionId) {
    const recent = await prisma.pageVisit.findFirst({
      where: {
        sessionId: parsed.data.sessionId,
        path,
        createdAt: { gte: new Date(Date.now() - 2 * 60 * 1000) },
      },
      select: { id: true },
    });
    if (recent) return NextResponse.json({ ok: true, deduped: true });
  }

  const geo = await resolveVisitLocation({
    ip,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
  });

  const visit = await prisma.pageVisit.create({
    data: {
      path,
      referrer: parsed.data.referrer || "",
      ip,
      country: geo.country,
      city: geo.city,
      region: geo.region,
      address: geo.address,
      isp: geo.isp,
      latitude: geo.latitude,
      longitude: geo.longitude,
      accuracy: typeof parsed.data.accuracy === "number" ? parsed.data.accuracy : null,
      locationSource: geo.locationSource,
      userAgent: ua.slice(0, 400),
      browser: detectBrowser(ua),
      os: detectOs(ua),
      device: detectDevice(ua),
      sessionId: parsed.data.sessionId || `anon-${Date.now()}`,
    },
  });

  return NextResponse.json({
    ok: true,
    id: visit.id,
    locationSource: visit.locationSource,
  });
}
