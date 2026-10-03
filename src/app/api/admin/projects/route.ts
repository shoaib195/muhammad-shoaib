import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidateSite } from "@/lib/revalidate-site";

export const runtime = "nodejs";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

const projectSchema = z.object({
  id: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  previousId: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/).optional(),
  name: z.string().min(1).max(200),
  tagline: z.string().max(300).optional().default(""),
  category: z.string().max(120).optional().default(""),
  challenge: z.string().max(1000).optional().default(""),
  platform: z.string().max(40).optional().default("Web"),
  period: z.string().max(80).optional().default(""),
  company: z.string().max(120).optional().default(""),
  cover: z.string().max(500).optional().default("/v2/w1.jpg"),
  images: z.array(z.string().max(500)).optional().default([]),
  overview: z.string().max(4000).optional().default(""),
  what: z.string().max(4000).optional().default(""),
  role: z.array(z.string()).optional().default([]),
  tech: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  impact: z.array(z.string()).optional().default([]),
  liveUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  sourceUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  status: z.string().max(60).optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const projects = await prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return NextResponse.json({ ok: true, projects });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const json = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 422 });
  }
  const data = parsed.data;
  const project = await prisma.project.create({
    data: {
      ...data,
      liveUrl: data.liveUrl || null,
      sourceUrl: data.sourceUrl || null,
      status: data.status || null,
    },
  });
  revalidateSite();
  return NextResponse.json({ ok: true, project });
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const json = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 422 });
  }
  const { id, previousId, ...rest } = parsed.data;
  const data = {
    ...rest,
    liveUrl: rest.liveUrl || null,
    sourceUrl: rest.sourceUrl || null,
    status: rest.status || null,
  };

  const fromId = previousId && previousId !== id ? previousId : id;

  try {
    if (fromId !== id) {
      const clash = await prisma.project.findUnique({ where: { id } });
      if (clash) {
        return NextResponse.json({ ok: false, error: "Slug already in use" }, { status: 409 });
      }
      const project = await prisma.$transaction(async (tx) => {
        const existing = await tx.project.findUnique({ where: { id: fromId } });
        if (!existing) throw new Error("NOT_FOUND");
        await tx.project.delete({ where: { id: fromId } });
        return tx.project.create({
          data: {
            id,
            ...data,
          },
        });
      });
      revalidateSite();
      return NextResponse.json({ ok: true, project });
    }

    const project = await prisma.project.update({
      where: { id },
      data,
    });
    revalidateSite();
    return NextResponse.json({ ok: true, project });
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_FOUND") {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 422 });
  await prisma.project.delete({ where: { id } });
  revalidateSite();
  return NextResponse.json({ ok: true });
}
