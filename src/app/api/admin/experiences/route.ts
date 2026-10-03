import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidateSite } from "@/lib/revalidate-site";

export const runtime = "nodejs";

const schema = z.object({
  id: z.string().optional(),
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  years: z.string().max(120).optional().default(""),
  summary: z.string().max(4000).optional().default(""),
  highlights: z.array(z.string()).optional().default([]),
  stack: z.array(z.string()).optional().default([]),
  outcomes: z.array(z.string()).optional().default([]),
  sortOrder: z.number().int().optional().default(0),
});

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const experiences = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ ok: true, experiences });
}

export async function POST(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 422 });
  const { id: _id, ...data } = parsed.data;
  const experience = await prisma.experience.create({ data });
  revalidateSite();
  return NextResponse.json({ ok: true, experience });
}

export async function PUT(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const parsed = schema.extend({ id: z.string().min(1) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 422 });
  const { id, ...data } = parsed.data;
  const experience = await prisma.experience.update({ where: { id }, data });
  revalidateSite();
  return NextResponse.json({ ok: true, experience });
}

export async function DELETE(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 422 });
  await prisma.experience.delete({ where: { id } });
  revalidateSite();
  return NextResponse.json({ ok: true });
}
