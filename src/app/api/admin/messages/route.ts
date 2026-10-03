import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, messages });
}

export async function PATCH(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { id?: string; read?: boolean } | null;
  if (!body?.id) return NextResponse.json({ ok: false, error: "id required" }, { status: 422 });
  const message = await prisma.contactMessage.update({
    where: { id: body.id },
    data: { read: body.read ?? true },
  });
  return NextResponse.json({ ok: true, message });
}

export async function DELETE(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 422 });
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
