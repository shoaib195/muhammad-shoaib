"use client";

import Image from "next/image";
import { about } from "../content";
import { site, socials } from "../data";
import { Reveal } from "./Reveal";
import styles from "./About.module.css";
import s from "../Site.module.css";

export function About() {
  const linkedin = socials.find((x) => x.label === "LinkedIn")?.href ?? "#";

  return (
    <section className={s.section} id="about">
      <div className={s.sectionGlow} aria-hidden="true" />
      <div className={`${s.container} ${styles.inner}`}>
        <Reveal className={styles.media}>
          <div className={styles.frame}>
            <span className={styles.frameBack} aria-hidden="true" />
            <Image
              src="/v2/about-bust.png"
              alt={`${site.name}, frontend engineer`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className={styles.img}
            />
            <span className={styles.frameFade} aria-hidden="true" />
            <span className={`${s.badge} ${styles.frameBadge}`}>
              <span className={s.badgeDot} />
              Open to new opportunities
            </span>
          </div>
          <p className={styles.caption}>
            <span className={s.hand}>based in Karachi, shipping worldwide</span>
          </p>
        </Reveal>

        <Reveal delay={0.08} className={styles.copy}>
          <div className={s.taglineRow}>
            <p className={s.tagline}>07 / About</p>
            <span className={s.taglineLine} aria-hidden="true" />
          </div>
          <h2 className={`${s.h2} ${styles.h2}`}>
            <span className={s.bright}>{about.heading}</span>
          </h2>
          <p className={styles.statement}>
            &ldquo;{about.statement}&rdquo;
          </p>
          {about.paragraphs.map((p) => (
            <p key={p} className={s.bodyMuted}>
              {p}
            </p>
          ))}

          <dl className={styles.facts}>
            <div>
              <dt>Preferred work</dt>
              <dd>{about.prefer.join(" · ")}</dd>
            </div>
            <div>
              <dt>Core stack</dt>
              <dd>{about.stack.join(" · ")}</dd>
            </div>
            <div>
              <dt>Remote</dt>
              <dd>{about.remote}</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            <a href="#contact" className={`${s.btn} ${s.btnPrimary}`}>
              Let&apos;s work together
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer" className={`${s.btn} ${s.btnSecondary}`}>
              LinkedIn
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 7h10v10M7 17 17 7" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
