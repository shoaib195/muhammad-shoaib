"use client";

import { footerLinks, site, socials } from "./data";
import { Reveal } from "./Reveal";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.inner}>
        <Reveal className={styles.top}>
          <div>
            <p className={styles.brand}>{site.brand}</p>
            <p className={styles.tag}>{site.tagline}</p>
          </div>
          <ul className={styles.nav}>
            {footerLinks.map((link) => (
              <li key={link.href + link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.contact} delay={0.08}>
          <div>
            <p className={styles.blockTitle}>CONTACT</p>
            <p className={styles.contactLine}>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p className={styles.contactLine}>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
            </p>
            <p className={styles.address}>{site.address}</p>
          </div>
          <div>
            <p className={styles.blockTitle}>SOCIALS</p>
            <ul className={styles.socials}>
              {socials.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className={styles.bottom}>
          <p className={styles.copy}>{site.copyright}</p>
          <p className={styles.note}>Designed for conversion.</p>
        </div>
      </div>
    </footer>
  );
}
