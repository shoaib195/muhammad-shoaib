"use client";

import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/data";
import styles from "./CTA.module.css";

export function CTA() {
  return (
    <section id="contact" className={`section ${styles.section}`} aria-labelledby="cta-title">
      <div className={`section__inner ${styles.inner}`}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <Reveal>
          <p className="section__meta">Contacts</p>
          <h2 id="cta-title" className={`display ${styles.title}`}>
            Let’s make
            <br />
            something <span className="serif">glow</span>
          </h2>
          <p className={styles.sub}>
            Tell me about the product, the mood, and the feeling you want people
            to leave with. I’ll reply with a clear next step.
          </p>
          <div className={styles.actions}>
            <MagneticButton href={`mailto:${site.email}`}>
              Start a project
            </MagneticButton>
            <a href={`mailto:${site.email}`} className={styles.email} data-cursor="hover">
              {site.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
