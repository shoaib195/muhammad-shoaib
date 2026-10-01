"use client";

import Image from "next/image";
import { showreel } from "./data";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import styles from "./Showreel.module.css";

export function Showreel() {
  return (
    <section
      id="showreel"
      className={styles.showreel}
      aria-labelledby="showreel-title"
    >
      <div className={styles.inner}>
        <Reveal className={styles.heading}>
          <h2 id="showreel-title" className={`${styles.word} ${styles.wordLeft}`}>
            {showreel.headingLeft}
          </h2>
          <div className={styles.video}>
            <button type="button" className={styles.videoPlay} aria-label="Play showreel">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
            </button>
          </div>
          <p className={styles.word}>{showreel.headingRight}</p>
        </Reveal>

        <div className={styles.body}>
          <Reveal>
            <h3 className={styles.aboutTitle}>{showreel.aboutTitle}</h3>
            <p className={styles.aboutText}>{showreel.about}</p>
            <a href="#contact" className={styles.cta}>
              {showreel.cta}
              <span aria-hidden="true">→</span>
            </a>

            <RevealGroup className={styles.stats}>
              {showreel.stats.map((stat) => (
                <RevealItem key={stat.label}>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>

          <Reveal delay={0.12}>
            <div className={styles.studio}>
              <Image
                src={showreel.studioImage}
                alt="Design studio interior"
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
