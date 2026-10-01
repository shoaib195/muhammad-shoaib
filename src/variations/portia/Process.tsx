"use client";

import { processSteps } from "./data";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import styles from "./Process.module.css";

export function Process() {
  return (
    <section id="process" className={styles.process} aria-labelledby="process-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <Reveal>
          <h2 id="process-title" className={styles.heading}>
            WORKING PROCESS
          </h2>
        </Reveal>

        <RevealGroup className={styles.grid}>
          {processSteps.map((step) => (
            <RevealItem key={step.number} className={styles.card}>
              <span className={styles.number}>{step.number}</span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
