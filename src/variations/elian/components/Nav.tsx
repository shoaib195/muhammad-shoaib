"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, site, socials } from "../data";
import styles from "./Nav.module.css";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dateLabel, setDateLabel] = useState(site.dateLabel);

  useEffect(() => {
    const d = new Date();
    const formatted = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setDateLabel(`Today — Through the lens ${formatted}`);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.nav} aria-label="Primary">
        <a href="#top" className={styles.brand} onClick={() => setOpen(false)}>
          {site.name}
        </a>

        <p className={styles.date}>{dateLabel}</p>

        <button
          type="button"
          className={`${styles.menuBtn} ${open ? styles.menuBtnOpen : ""}`}
          aria-expanded={open}
          aria-controls="elian-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="elian-menu"
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <motion.div
              className={styles.overlayInner}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className={styles.menuList}>
                {navLinks.map((link, i) => (
                  <li key={link.href}>
                    <motion.a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * i, duration: 0.4 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
              <div className={styles.menuMeta}>
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <a
                  href={site.resumeUrl}
                  download={site.resumeFileName}
                  className={styles.resumeLink}
                  onClick={() => setOpen(false)}
                >
                  Download Resume
                </a>
                <div className={styles.socials}>
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        s.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={() => setOpen(false)}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
