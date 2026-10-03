import { NextResponse } from "next/server";
import { isSmtpReady, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  details?: string;
  website?: string; // honeypot
};

const TO = process.env.CONTACT_TO_EMAIL ?? process.env.SMTP_USER ?? "shoaib.octachat@gmail.com";

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields; humans never see it.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const company = clean(body.company, 200);
  const projectType = clean(body.projectType, 80);
  const details = clean(body.details, 4000);

  if (!name || !email || !details) {
    return NextResponse.json({ ok: false, error: "Name, email and project details are required." }, { status: 422 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
  }

  // Always persist for admin inbox first
  let messageId: string | null = null;
  try {
    const { prisma } = await import("@/lib/db");
    const saved = await prisma.contactMessage.create({
      data: {
        name,
        email,
        company: company || null,
        projectType: projectType || null,
        details,
      },
    });
    messageId = saved.id;
  } catch (err) {
    console.warn("[contact] could not save message to DB", err);
    return NextResponse.json({ ok: false, error: "Could not save your message. Please try again." }, { status: 500 });
  }

  const subject = `Inquiry from ${name}${projectType ? ` — ${projectType}` : ""}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company / website: ${company}` : null,
    projectType ? `Project type: ${projectType}` : null,
    "",
    details,
  ]
    .filter((l) => l !== null)
    .join("\n");

  if (!isSmtpReady()) {
    console.warn("[contact] SMTP not configured. Saved to DB:", messageId);
    return NextResponse.json({
      ok: true,
      saved: true,
      emailed: false,
      id: messageId,
      warning: "Saved to admin inbox. SMTP is not configured.",
    });
  }

  const html = `
    <div style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#111">
      <h2 style="margin:0 0 12px">${esc(subject)}</h2>
      <p><b>Name:</b> ${esc(name)}<br/><b>Email:</b> <a href="mailto:${esc(email)}">${esc(email)}</a>
      ${company ? `<br/><b>Company / website:</b> ${esc(company)}` : ""}
      ${projectType ? `<br/><b>Project type:</b> ${esc(projectType)}` : ""}</p>
      <p style="white-space:pre-wrap;border-left:3px solid #eb3514;padding-left:12px">${esc(details)}</p>
    </div>`;

  const sent = await sendMail({
    to: TO,
    subject,
    text,
    html,
    replyTo: email,
  });

  if (!sent.ok) {
    return NextResponse.json({
      ok: true,
      saved: true,
      emailed: false,
      id: messageId,
      warning: `Saved to admin inbox, but SMTP delivery failed: ${sent.error}`,
    });
  }

  return NextResponse.json({ ok: true, saved: true, emailed: true, id: messageId });
}
