"use client";

import { recognition } from "./data";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import styles from "./Recognition.module.css";

export function Recognition() {
  return (
    <section
      id="recognition"
      className={styles.recognition}
      aria-labelledby="recognition-title"
    >
      <div className={styles.inner}>
        <Reveal>
          <h2 id="recognition-title" className={styles.heading}>
            {recognition.heading}
          </h2>
        </Reveal>

        <RevealGroup className={styles.list}>
          {recognition.items.map((item) => (
            <RevealItem key={item.name} className={styles.item}>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.blurb}>{item.blurb}</p>
              <div className={styles.meta}>
                <p className={styles.rating}>{item.rating}</p>
                <p className={styles.year}>{item.year}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className={styles.logos}>
          {recognition.logos.map((logo) => (
            <p key={logo} className={styles.logo}>
              {logo}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
