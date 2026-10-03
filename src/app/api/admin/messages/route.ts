import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSmtpReady, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });
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

const replySchema = z.object({
  id: z.string().min(1),
  body: z.string().min(1).max(8000),
});

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const parsed = replySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid reply" }, { status: 422 });

  const message = await prisma.contactMessage.findUnique({ where: { id: parsed.data.id } });
  if (!message) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const subject = `Re: Your message — ${message.name}`;
  const text = parsed.data.body;

  if (!isSmtpReady()) {
    return NextResponse.json(
      { ok: false, error: "SMTP is not configured. Add SMTP_* vars to .env to send replies." },
      { status: 503 },
    );
  }

  const html = `
    <div style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#111">
      <p>Hi ${message.name.replace(/[<>]/g, "")},</p>
      <p style="white-space:pre-wrap">${text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] || c)}</p>
      <p style="color:#666;margin-top:24px">— Muhammad Shoaib</p>
    </div>`;

  let emailed = false;
  let emailWarning = "";

  const sent = await sendMail({
    to: message.email,
    subject,
    text,
    html,
    replyTo: process.env.CONTACT_TO_EMAIL || process.env.SMTP_FROM_EMAIL || session.email,
  });

  if (!sent.ok) {
    emailWarning = `${sent.error} Reply was still saved in admin.`;
  } else {
    emailed = true;
  }

  // Always keep a record in the inbox, even if SMTP fails
  const reply = await prisma.contactReply.create({
    data: {
      messageId: message.id,
      body: parsed.data.body,
      sentBy: session.email,
    },
  });
  await prisma.contactMessage.update({
    where: { id: message.id },
    data: { read: true, repliedAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    reply,
    emailed,
    warning: emailWarning || undefined,
  });
}
