import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getExcludeIps, readRequestIp, SKIP_ANALYTICS_COOKIE } from "@/lib/analytics";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const [excludeIps, ip] = await Promise.all([getExcludeIps(), readRequestIp()]);
  return NextResponse.json({ ok: true, excludeIps, currentIp: ip });
}

const schema = z.object({
  excludeIps: z.array(z.string().max(80)).max(50).optional(),
  addCurrentIp: z.boolean().optional(),
  skipBrowser: z.boolean().optional(),
});

export async function PUT(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 });

  let excludeIps = parsed.data.excludeIps;
  if (excludeIps === undefined) {
    excludeIps = await getExcludeIps();
  }
  if (parsed.data.addCurrentIp) {
    const ip = await readRequestIp();
    if (ip) excludeIps = Array.from(new Set([...excludeIps, ip]));
  }

  await prisma.siteSetting.upsert({
    where: { key: "analytics" },
    create: { key: "analytics", value: { excludeIps } },
    update: { value: { excludeIps } },
  });

  const res = NextResponse.json({ ok: true, excludeIps });
  if (typeof parsed.data.skipBrowser === "boolean") {
    res.cookies.set(SKIP_ANALYTICS_COOKIE, parsed.data.skipBrowser ? "1" : "0", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: parsed.data.skipBrowser ? 60 * 60 * 24 * 400 : 0,
    });
  }
  return res;
}
