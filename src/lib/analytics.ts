import { cookies, headers } from "next/headers";

export const SKIP_ANALYTICS_COOKIE = "ms_skip_analytics";

export type GeoResult = {
  country: string;
  city: string;
  region: string;
  address: string;
  isp: string;
  latitude: number | null;
  longitude: number | null;
  locationSource: "ip" | "gps" | "local";
};

export function isPrivateIp(ip: string) {
  if (!ip) return true;
  const n = normalizeIp(ip);
  if (n === "127.0.0.1" || n === "localhost") return true;
  if (n.startsWith("10.") || n.startsWith("192.168.") || n.startsWith("127.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(n)) return true;
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

export function formatLocation(opts: {
  address?: string;
  city?: string;
  region?: string;
  country?: string;
}) {
  if (opts.address?.trim()) return opts.address.trim();
  const parts = [opts.city, opts.region].filter(
    (p) => p && p !== "Development" && p !== opts.country,
  );
  if (parts.length) return parts.join(", ");
  if (opts.country === "Local") return "Local development";
  return opts.country || "—";
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

/** Free reverse-geocode via OpenStreetMap Nominatim (street / area when available). */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "18");

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "MuhammadShoaibPortfolio/1.0 (admin analytics)",
      },
    });
    if (!res.ok) return "";
    const data = (await res.json()) as {
      display_name?: string;
      address?: Record<string, string>;
    };
    const a = data.address || {};
    const street = [a.house_number, a.road || a.pedestrian || a.footway].filter(Boolean).join(" ").trim();
    const area = a.neighbourhood || a.suburb || a.quarter || a.residential || a.city_district;
    const city = a.city || a.town || a.village || a.municipality;
    const bits = [street, area, city, a.state || a.region, a.country].filter(Boolean);
    if (bits.length >= 2) return bits.join(", ").slice(0, 280);
    return (data.display_name || "").slice(0, 280);
  } catch {
    return "";
  }
}

export type ReverseGeoDetails = {
  address: string;
  city: string;
  region: string;
  country: string;
};

export async function reverseGeocodeDetails(lat: number, lon: number): Promise<ReverseGeoDetails> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "18");

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "MuhammadShoaibPortfolio/1.0 (admin analytics)",
      },
    });
    if (!res.ok) return { address: "", city: "", region: "", country: "" };
    const data = (await res.json()) as {
      display_name?: string;
      address?: Record<string, string>;
    };
    const a = data.address || {};
    const street = [a.house_number, a.road || a.pedestrian || a.footway].filter(Boolean).join(" ").trim();
    const area = a.neighbourhood || a.suburb || a.quarter || a.residential || a.city_district;
    const city = a.city || a.town || a.village || a.municipality || "";
    const region = a.state || a.region || "";
    const country = a.country || "";
    const bits = [street, area, city, region, country].filter(Boolean);
    return {
      address: (bits.length >= 2 ? bits.join(", ") : data.display_name || "").slice(0, 280),
      city,
      region,
      country,
    };
  } catch {
    return { address: "", city: "", region: "", country: "" };
  }
}

/** Free IP geo via ipwho.is (no API key) — city-level, not street. */
export async function lookupGeo(ip: string): Promise<GeoResult> {
  const n = normalizeIp(ip);
  if (!n || isPrivateIp(n)) {
    return {
      country: "Local",
      city: "",
      region: "",
      address: "Local development",
      isp: "",
      latitude: null,
      longitude: null,
      locationSource: "local",
    };
  }
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(n)}`, { cache: "no-store" });
    if (!res.ok) {
      return {
        country: "Unknown",
        city: "",
        region: "",
        address: "",
        isp: "",
        latitude: null,
        longitude: null,
        locationSource: "ip",
      };
    }
    const data = (await res.json()) as {
      success?: boolean;
      country?: string;
      city?: string;
      region?: string;
      latitude?: number;
      longitude?: number;
      connection?: { isp?: string };
      flag?: { emoji?: string };
    };
    if (data.success === false) {
      return {
        country: "Unknown",
        city: "",
        region: "",
        address: "",
        isp: "",
        latitude: null,
        longitude: null,
        locationSource: "ip",
      };
    }
    const city = data.city || "";
    const region = data.region || "";
    const country = data.country || "Unknown";
    return {
      country,
      city,
      region,
      address: formatLocation({ city, region, country }),
      isp: data.connection?.isp || "",
      latitude: typeof data.latitude === "number" ? data.latitude : null,
      longitude: typeof data.longitude === "number" ? data.longitude : null,
      locationSource: "ip",
    };
  } catch {
    return {
      country: "Unknown",
      city: "",
      region: "",
      address: "",
      isp: "",
      latitude: null,
      longitude: null,
      locationSource: "ip",
    };
  }
}

export async function resolveVisitLocation(opts: {
  ip: string;
  latitude?: number | null;
  longitude?: number | null;
}): Promise<GeoResult & { accuracy: number | null }> {
  const ipGeo = await lookupGeo(opts.ip);
  const lat = opts.latitude;
  const lon = opts.longitude;

  if (
    typeof lat === "number" &&
    typeof lon === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180
  ) {
    const details = await reverseGeocodeDetails(lat, lon);
    return {
      country: details.country || ipGeo.country,
      city: details.city || ipGeo.city,
      region: details.region || ipGeo.region,
      address: details.address || ipGeo.address,
      isp: ipGeo.isp,
      latitude: lat,
      longitude: lon,
      locationSource: "gps",
      accuracy: null,
    };
  }

  return { ...ipGeo, accuracy: null };
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
