"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { HEADER_OFFSET, peekPendingHash, registerLenis, scrollToHash, takePendingHash, unregisterLenis } from "@/site/scroll";

export function SmoothScroll() {
  const pathname = usePathname();

  // Lenis instance (skipped for reduced motion; helpers fall back to native smooth scroll).
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.2,
      anchors: false,
    });
    registerLenis(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      unregisterLenis(lenis);
      lenis.destroy();
    };
  }, []);

  // Delegated handler: any same-page "#hash" / "/#hash" anchor scrolls smoothly.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const raw = a.getAttribute("href") ?? "";
      if (!raw.includes("#")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      if (!url.hash && !raw.endsWith("#top")) return;
      e.preventDefault();
      scrollToHash(url.hash || "#top");
      history.replaceState(null, "", url.hash || window.location.pathname);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // After a route change (or a hard load with a hash) glide to the target.
  useEffect(() => {
    // Peek (don't consume) so a StrictMode double-run can't swallow the target.
    const pending = peekPendingHash();
    const hash = pending ?? (window.location.hash || "");
    if (!hash) return;
    if (pending) window.scrollTo(0, 0);

    const timers: number[] = [];
    const run = () => {
      takePendingHash();
      scrollToHash(hash);
    };
    // First attempt once the new page has settled; Lenis needs a couple of
    // frames after a route change before programmatic scrolls take effect.
    timers.push(window.setTimeout(run, pending ? 350 : 250));
    // Safety retry: if nothing moved (e.g. images shifted layout), try once more.
    timers.push(
      window.setTimeout(() => {
        const id = hash.replace(/^#/, "");
        const el = id && id !== "top" ? document.getElementById(id) : null;
        const off = el ? Math.abs(el.getBoundingClientRect().top - HEADER_OFFSET) : window.scrollY;
        if (off > 24) run();
      }, pending ? 1400 : 1200),
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [pathname]);

  return null;
}
