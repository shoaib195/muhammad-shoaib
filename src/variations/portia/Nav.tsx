"use client";

import { useState } from "react";
import { navLinks, site } from "./data";
import styles from "./Nav.module.css";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <a href="#top" className={styles.logo}>
          {site.brand}
        </a>

        <nav aria-label="Primary">
          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contact" className={styles.cta}>
          LET&apos;S TALK
        </a>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="portia-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
        </button>
      </div>

      <div
        id="portia-mobile-nav"
        className={styles.drawer}
        hidden={!open}
      >
        <ul className={styles.drawerList}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
