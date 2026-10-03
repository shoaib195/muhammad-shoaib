import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  details?: string;
  website?: string; // honeypot
};

const TO = process.env.CONTACT_TO_EMAIL ?? "shoaib.octachat@gmail.com";
const FROM = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
const RESEND_KEY = process.env.RESEND_API_KEY;

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

  // Persist for admin inbox (ignore DB errors so mail path still works)
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        company: company || null,
        projectType: projectType || null,
        details,
      },
    });
  } catch (err) {
    console.warn("[contact] could not save message to DB", err);
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

  if (!RESEND_KEY) {
    // No mail provider configured: tell the client so it can fall back to mailto.
    console.warn("[contact] RESEND_API_KEY not set. Inquiry:\n" + text);
    return NextResponse.json(
      { ok: false, fallback: true, error: "Mail service is not configured yet." },
      { status: 503 },
    );
  }

  const html = `
    <div style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#111">
      <h2 style="margin:0 0 12px">${esc(subject)}</h2>
      <p><b>Name:</b> ${esc(name)}<br/><b>Email:</b> <a href="mailto:${esc(email)}">${esc(email)}</a>
      ${company ? `<br/><b>Company / website:</b> ${esc(company)}` : ""}
      ${projectType ? `<br/><b>Project type:</b> ${esc(projectType)}` : ""}</p>
      <p style="white-space:pre-wrap;border-left:3px solid #eb3514;padding-left:12px">${esc(details)}</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text, html }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[contact] Resend error", res.status, err);
    return NextResponse.json({ ok: false, fallback: true, error: "Could not send right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
