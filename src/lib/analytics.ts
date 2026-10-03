import { cookies, headers } from "next/headers";

export const SKIP_ANALYTICS_COOKIE = "ms_skip_analytics";

export function isPrivateIp(ip: string) {
  if (!ip) return true;
  const n = normalizeIp(ip);
  if (n === "127.0.0.1" || n === "localhost") return true;
  if (n.startsWith("10.") || n.startsWith("192.168.") || n.startsWith("127.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(n)) return true;
  // Unique local / link-local IPv6
  if (n.includes(":") && (n.startsWith("fc") || n.startsWith("fd") || n.startsWith("fe80"))) return true;
  return false;
}

/** Prefer a readable IPv4 string; map loopback / IPv4-mapped forms. */
export function normalizeIp(raw: string) {
  let ip = (raw || "").trim().replace(/^\[|\]$/g, "");
  if (!ip) return "";
  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") return "127.0.0.1";
  const mapped = ip.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
  if (mapped) return mapped[1];
  // Strip optional port on IPv4
  const withPort = ip.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  if (withPort) return withPort[1];
  return ip;
}

export function getClientIp(h: Headers) {
  const candidates = [
    h.get("cf-connecting-ip"),
    h.get("x-real-ip"),
    h.get("x-forwarded-for")?.split(",")[0],
    h.get("x-client-ip"),
    h.get("true-client-ip"),
  ];
  for (const c of candidates) {
    const n = normalizeIp(c?.trim() || "");
    if (n) return n;
  }
  return "";
}

export function detectDevice(ua: string) {
  const v = ua.toLowerCase();
  if (/ipad|tablet|kindle|playbook/.test(v)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone|opera mini/.test(v)) return "mobile";
  return "desktop";
}

export function detectBrowser(ua: string) {
  const v = ua || "";
  if (!v) return "Unknown";
  if (/edg\//i.test(v)) return "Microsoft Edge";
  if (/opr\/|opera/i.test(v)) return "Opera";
  if (/samsungbrowser/i.test(v)) return "Samsung Internet";
  if (/chrome|crios/i.test(v) && !/edg\//i.test(v)) return "Chrome";
  if (/firefox|fxios/i.test(v)) return "Firefox";
  if (/safari/i.test(v) && !/chrome|crios|android/i.test(v)) return "Safari";
  if (/msie|trident/i.test(v)) return "Internet Explorer";
  return "Other";
}

export function detectOs(ua: string) {
  const v = ua || "";
  if (!v) return "Unknown";
  if (/windows nt 10/i.test(v)) return "Windows 10/11";
  if (/windows nt 6\.3/i.test(v)) return "Windows 8.1";
  if (/windows nt 6\.2/i.test(v)) return "Windows 8";
  if (/windows nt 6\.1/i.test(v)) return "Windows 7";
  if (/windows/i.test(v)) return "Windows";
  if (/iphone/i.test(v)) return "iPhone (iOS)";
  if (/ipad/i.test(v)) return "iPad (iPadOS)";
  if (/mac os x/i.test(v)) {
    const m = v.match(/mac os x (\d+)[._](\d+)/i);
    if (m) return `macOS ${m[1]}.${m[2]}`;
    return "macOS";
  }
  if (/android/i.test(v)) {
    const m = v.match(/android (\d+(?:\.\d+)?)/i);
    return m ? `Android ${m[1]}` : "Android";
  }
  if (/cros/i.test(v)) return "Chrome OS";
  if (/linux/i.test(v)) return "Linux";
  if (/ubuntu/i.test(v)) return "Ubuntu";
  return "Unknown";
}

export function formatLocation(city: string, region: string, country: string) {
  const parts = [city, region].filter((p) => p && p !== "Development" && p !== country);
  if (parts.length) return parts.join(", ");
  if (country === "Local") return "Local development";
  return country || "—";
}

export async function getExcludeIps(): Promise<string[]> {
  const fromEnv = (process.env.ANALYTICS_EXCLUDE_IPS || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map(normalizeIp);
  try {
    const { prisma } = await import("@/lib/db");
    const row = await prisma.siteSetting.findUnique({ where: { key: "analytics" } });
    const value = row?.value as { excludeIps?: string[] } | null;
    const fromDb = Array.isArray(value?.excludeIps) ? value!.excludeIps! : [];
    return Array.from(new Set([...fromEnv, ...fromDb.map(normalizeIp)].filter(Boolean)));
  } catch {
    return fromEnv;
  }
}

/**
 * Skip only admin/api, opt-out cookie, or explicitly excluded IPs.
 * Localhost IS tracked (as Local) so the dashboard can show real DB rows while developing.
 * Use Settings → exclude browser / IP to keep your own tests out of production stats.
 */
export async function shouldSkipAnalytics(opts: {
  path: string;
  ip: string;
  cookieSkip?: boolean;
}) {
  if (!opts.path || opts.path.startsWith("/admin") || opts.path.startsWith("/api")) return true;
  if (opts.cookieSkip) return true;
  const exclude = await getExcludeIps();
  const ip = normalizeIp(opts.ip);
  if (ip && exclude.includes(ip)) return true;
  return false;
}

export async function lookupGeo(ip: string): Promise<{ country: string; city: string; region: string }> {
  const n = normalizeIp(ip);
  if (!n || isPrivateIp(n)) {
    return { country: "Local", city: "", region: "" };
  }
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(n)}?fields=status,country,city,regionName`,
      { cache: "no-store" },
    );
    if (!res.ok) return { country: "Unknown", city: "", region: "" };
    const data = (await res.json()) as {
      status?: string;
      country?: string;
      city?: string;
      regionName?: string;
    };
    if (data.status !== "success") return { country: "Unknown", city: "", region: "" };
    return {
      country: data.country || "Unknown",
      city: data.city || "",
      region: data.regionName || "",
    };
  } catch {
    return { country: "Unknown", city: "", region: "" };
  }
}

export async function analyticsContextFromRequest(req: Request) {
  const h = req.headers;
  const ip = getClientIp(h);
  const cookieHeader = h.get("cookie") || "";
  const cookieSkip = /(?:^|;\s*)ms_skip_analytics=1(?:;|$)/.test(cookieHeader);
  return { ip, cookieSkip, ua: h.get("user-agent") || "" };
}

export async function readSkipCookie() {
  const jar = await cookies();
  return jar.get(SKIP_ANALYTICS_COOKIE)?.value === "1";
}

export async function readRequestIp() {
  const h = await headers();
  return getClientIp(h);
}
