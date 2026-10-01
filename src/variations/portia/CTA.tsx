"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cta } from "./data";
import { easeOut } from "./motion";
import { Reveal } from "./Reveal";
import styles from "./CTA.module.css";

export function CTA() {
  const reduced = useReducedMotion();

  return (
    <section className={styles.cta} aria-labelledby="cta-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.titleWrap}>
            <motion.span
              className={styles.circle}
              aria-hidden="true"
              initial={reduced ? false : { scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
            />
            <h2 id="cta-title" className={styles.title}>
              {cta.title}
            </h2>
          </div>
          <p className={styles.subtitle}>{cta.subtitle}</p>
          <a href="#contact" className={styles.link}>
            START A PROJECT
          </a>
        </Reveal>
      </div>
    </section>
  );
}
