"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navCta, navLinks, site } from "../data";
import { useTheme } from "../theme";
import { splitHref } from "../scroll";
import { SmartLink } from "./SmartLink";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState("top");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which home section is in view (only meaningful on "/").
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["top", ...navLinks.map((l) => splitHref(l.href).hash.replace("#", "")).filter(Boolean)];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const isActive = (href: string) => {
    const { path, hash } = splitHref(href);
    if (pathname !== "/") return path === pathname && !hash;
    if (path !== "/") return false;
    return hash ? section === hash.slice(1) : section === "top";
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <motion.header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.inner}>
        <SmartLink href="/" className={styles.brand} onClick={() => setOpen(false)} aria-label={`${site.name} home`}>
          <Image
            src="/v2/main-logo.png"
            alt={site.name}
            width={220}
            height={40}
            className={styles.logoImg}
            priority
          />
        </SmartLink>

        <nav className={styles.desktop} aria-label="Primary">
          {navLinks.map((l) => (
            <SmartLink
              key={l.href}
              href={l.href}
              className={`${styles.link} ${isActive(l.href) ? styles.linkActive : ""}`}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </SmartLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeBtn}
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            <span className={styles.themeTrack} aria-hidden="true">
              <motion.span
                className={styles.themeThumb}
                animate={{ x: theme === "dark" ? 0 : 18 }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              >
                {theme === "dark" ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                )}
              </motion.span>
            </span>
          </button>

          <SmartLink href={navCta.href} className={styles.dashboard}>
            <span className={styles.access}>
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                  d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"
                  fill="currentColor"
                />
                <path d="M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className={styles.shimmer}>{navCta.label}</span>
            </span>
          </SmartLink>
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 12H9" />
              <path d="M21 18H7" />
              <path d="M21 6H3" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul>
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <SmartLink href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </SmartLink>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * navLinks.length }}
              >
                <SmartLink href={navCta.href} onClick={() => setOpen(false)} className={styles.overlayCta}>
                  {navCta.label} →
                </SmartLink>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (navLinks.length + 1) }}
              >
                <a href={site.resumeUrl} download={site.resumeFileName} onClick={() => setOpen(false)}>
                  Resume (PDF)
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
