import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const [projects, experiences, messages, unread] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  return NextResponse.json({
    ok: true,
    email: session.email,
    stats: { projects, experiences, messages, unread },
  });
}
