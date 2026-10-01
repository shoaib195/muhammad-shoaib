"use client";

import { processSteps } from "../data";
import { Reveal } from "./Reveal";
import styles from "./Process.module.css";

export function Process() {
  return (
    <section className={styles.section} id="process" aria-labelledby="elian-process">
      <div className={styles.glow} aria-hidden="true" />
      <Reveal>
        <h2 id="elian-process" className={styles.title}>
          Here&apos;s how it <span className={styles.italic}>works</span>
        </h2>
      </Reveal>

      <div className={styles.grid}>
        <svg className={styles.connector} viewBox="0 0 1000 200" aria-hidden="true">
          <path
            d="M80 120 C 250 20, 400 180, 520 90 S 780 40, 920 130"
            fill="none"
            stroke="rgba(200,255,0,0.85)"
            strokeWidth="3"
            strokeDasharray="6 10"
            strokeLinecap="round"
          />
        </svg>

        {processSteps.map((step, i) => (
          <Reveal key={step.number} delay={i * 0.08}>
            <article className={`${styles.card} ${styles[`tilt${i + 1}`]}`}>
              <span className={styles.number}>{step.number}</span>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.desc}>{step.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
