import type Lenis from "lenis";

/**
 * Tiny registry so any component can trigger a smooth scroll through the
 * active Lenis instance (falls back to native smooth scrolling).
 */
let lenisRef: Lenis | null = null;

export const HEADER_OFFSET = 72; // fixed header height in px (4.5rem)
const PENDING_KEY = "ms-scroll-target";

export function registerLenis(l: Lenis) {
  lenisRef = l;
}

/** Only clears the registry if `l` is still the active instance (safe across remounts). */
export function unregisterLenis(l: Lenis) {
  if (lenisRef === l) lenisRef = null;
}

export function getLenis() {
  return lenisRef;
}

export function scrollToHash(hash: string, opts: { immediate?: boolean } = {}) {
  if (typeof window === "undefined") return;
  const id = hash.replace(/^#/, "");
  if (!id || id === "top") {
    if (lenisRef) lenisRef.scrollTo(0, { duration: 1.2, immediate: opts.immediate });
    else window.scrollTo({ top: 0, behavior: opts.immediate ? "auto" : "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) {
    lenisRef.scrollTo(el, { offset: -HEADER_OFFSET, duration: 1.2, immediate: opts.immediate });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: opts.immediate ? "auto" : "smooth" });
  }
}

/** Remember a hash to scroll to after a client-side route change. */
export function setPendingHash(hash: string) {
  try {
    sessionStorage.setItem(PENDING_KEY, hash);
  } catch {
    /* ignore */
  }
}

export function peekPendingHash(): string | null {
  try {
    return sessionStorage.getItem(PENDING_KEY);
  } catch {
    return null;
  }
}

export function takePendingHash(): string | null {
  try {
    const v = sessionStorage.getItem(PENDING_KEY);
    if (v) sessionStorage.removeItem(PENDING_KEY);
    return v;
  } catch {
    return null;
  }
}

/** Split "/#about" → { path: "/", hash: "#about" } */
export function splitHref(href: string) {
  const i = href.indexOf("#");
  if (i === -1) return { path: href, hash: "" };
  return { path: href.slice(0, i) || "/", hash: href.slice(i) };
}
