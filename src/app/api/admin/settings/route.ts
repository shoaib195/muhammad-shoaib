import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidateSite } from "@/lib/revalidate-site";
import { LANDING_SETTING_KEY } from "@/site/cms/defaults";
import { mergeLanding } from "@/site/cms/load-client";

export const runtime = "nodejs";

const schema = z.object({
  key: z.string().min(1).max(80),
  value: z.unknown(),
});

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const rows = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  if (!settings[LANDING_SETTING_KEY]) {
    settings[LANDING_SETTING_KEY] = mergeLanding(null);
  } else {
    settings[LANDING_SETTING_KEY] = mergeLanding(settings[LANDING_SETTING_KEY]);
  }
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 422 });

  let value = parsed.data.value;
  if (parsed.data.key === LANDING_SETTING_KEY) {
    value = mergeLanding(value);
  }

  const setting = await prisma.siteSetting.upsert({
    where: { key: parsed.data.key },
    create: { key: parsed.data.key, value: value as object },
    update: { value: value as object },
  });
  revalidateSite();
  return NextResponse.json({ ok: true, setting });
}
