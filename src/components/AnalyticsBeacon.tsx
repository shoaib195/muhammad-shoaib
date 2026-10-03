"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "ms_analytics_sid";

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

/** Lightweight public-site tracker. Skips admin routes client-side too. */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    // Never track admin (or API) routes — keeps dashboard testing out of analytics too
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const hash = typeof window !== "undefined" ? window.location.hash.slice(0, 80) : "";
    const body = {
      path: `${pathname}${hash}`,
      referrer: typeof document !== "undefined" ? document.referrer.slice(0, 500) : "",
      sessionId: getSessionId(),
    };

    const run = () => {
      void fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    };

    // Avoid competing with LCP
    if ("requestIdleCallback" in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(run);
    } else {
      setTimeout(run, 800);
    }
  }, [pathname]);

  return null;
}
