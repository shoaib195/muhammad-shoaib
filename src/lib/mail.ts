import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export type SendMailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

const CONNECT_MS = 12_000;
const GREETING_MS = 12_000;
const SOCKET_MS = 20_000;

function smtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getFromAddress() {
  const email = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "";
  const name = process.env.SMTP_FROM_NAME || "Muhammad Shoaib";
  if (!email) return name;
  return `${name} <${email}>`;
}

function transportOptions(port: number, secure: boolean): SMTPTransport.Options {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  return {
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: CONNECT_MS,
    greetingTimeout: GREETING_MS,
    socketTimeout: SOCKET_MS,
    tls: {
      // Gmail on some networks needs modern TLS; reject unauthorized stays on
      minVersion: "TLSv1.2",
    },
  };
}

/** Prefer configured port, then fall back (587↔465) — many ISPs block 587. */
function candidatePorts(): { port: number; secure: boolean }[] {
  const configured = Number(process.env.SMTP_PORT || 465);
  const secureEnv = process.env.SMTP_SECURE;
  const configuredSecure =
    secureEnv === "true" || secureEnv === "1" || (secureEnv !== "false" && configured === 465);

  const primary = { port: configured, secure: configuredSecure };
  const alt = configured === 465 ? { port: 587, secure: false } : { port: 465, secure: true };

  // Always try 465 first for Gmail when host is gmail (more reliable on blocked networks)
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").toLowerCase();
  if (host.includes("gmail.com")) {
    return [
      { port: 465, secure: true },
      { port: 587, secure: false },
    ];
  }
  return [primary, alt];
}

async function sendWithPort(
  input: SendMailInput,
  port: number,
  secure: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const transport = nodemailer.createTransport(transportOptions(port, secure));
    await transport.sendMail({
      from: getFromAddress(),
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo,
    });
    transport.close();
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "SMTP send failed";
    return { ok: false, error: `${message} (port ${port})` };
  }
}

export async function sendMail(input: SendMailInput): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!smtpConfigured()) {
    return { ok: false, error: "SMTP is not configured. Set SMTP_USER and SMTP_PASS in .env." };
  }

  const errors: string[] = [];
  for (const { port, secure } of candidatePorts()) {
    const result = await sendWithPort(input, port, secure);
    if (result.ok) return result;
    errors.push(result.error);
    console.warn("[mail] SMTP attempt failed:", result.error);
  }

  const message = errors.join(" → ");
  console.error("[mail] SMTP error", message);
  return { ok: false, error: message };
}

export function isSmtpReady() {
  return smtpConfigured();
}
