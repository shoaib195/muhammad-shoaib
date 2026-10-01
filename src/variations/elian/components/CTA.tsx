"use client";

import { site } from "../data";
import { Reveal } from "./Reveal";
import styles from "./CTA.module.css";

export function CTA() {
  return (
    <section className={styles.section} id="contact" aria-labelledby="elian-cta">
      <div className={styles.glow} aria-hidden="true" />
      <Reveal className={styles.inner}>
        <h2 id="elian-cta" className={styles.title}>
          Let&apos;s Make It <em>Happen</em>
        </h2>
        <p className={styles.sub}>{site.ctaSub}</p>
        <div className={styles.actions}>
          <a href={`mailto:${site.email}`} className={styles.btn}>
            Email Me
          </a>
          <a
            href={site.resumeUrl}
            download={site.resumeFileName}
            className={styles.btnGhost}
          >
            Download Resume
          </a>
        </div>
        <p className={styles.meta}>
          {site.phone} · {site.location}
        </p>
      </Reveal>
    </section>
  );
}
