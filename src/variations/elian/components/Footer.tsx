"use client";

import { footerLinks, site } from "../data";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <nav aria-label="Footer">
          <ul className={styles.links}>
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.copy}>
          © {year} {site.name}. All rights reserved.
        </p>
      </div>

      <div className={styles.mega} aria-hidden="true">
        <p className={styles.megaName}>{site.name}</p>
      </div>
    </footer>
  );
}
