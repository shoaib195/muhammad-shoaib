"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navLinks, site } from "@/lib/data";
import styles from "./Navigation.module.css";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
    >
      <div className={styles.inner}>
        <a
          href="#top"
          className={styles.logo}
          data-cursor="hover"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.list}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link} data-cursor="hover">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={`${styles.menuBtn} ${open ? styles.menuOpen : ""}`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          data-cursor="hover"
        >
          <span />
          <span />
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`${styles.mobile} ${open ? styles.mobileOpen : ""}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul>
            <li>
              <a href="#top" onClick={() => setOpen(false)} data-cursor="hover">
                Home
              </a>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} data-cursor="hover">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}
