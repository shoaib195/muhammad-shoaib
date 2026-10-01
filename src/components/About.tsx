"use client";

import { about, site } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className={`section ${styles.section}`} aria-labelledby="about-title">
      <div className={`section__inner ${styles.inner}`}>
        <Reveal className={styles.left}>
          <p className="section__meta">About</p>
          <h2 id="about-title" className={`display ${styles.heading}`}>
            {site.fullName}
          </h2>
          <p className={styles.role}>Creative visual designer</p>
        </Reveal>

        <Reveal className={styles.right} delay={0.1}>
          <p className={styles.lead}>{about.lead}</p>
          <p className={styles.body}>{about.body}</p>
          <div className={styles.facts}>
            <div>
              <span className={styles.factLabel}>Based</span>
              <span className={styles.factValue}>{site.location}</span>
            </div>
            <div>
              <span className={styles.factLabel}>Focus</span>
              <span className={styles.factValue}>{site.disciplines}</span>
            </div>
            <div>
              <span className={styles.factLabel}>Contact</span>
              <a href={`mailto:${site.email}`} className={styles.factValue} data-cursor="hover">
                {site.email}
              </a>
            </div>
          </div>
        </Reveal>

        <div className={styles.marquee} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>
                Creative <em>visual</em> designer · Available worldwide ·
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
