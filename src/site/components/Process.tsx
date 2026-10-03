"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useLanding } from "../cms/CmsProvider";
import { Reveal } from "./Reveal";
import styles from "./Process.module.css";
import s from "../Site.module.css";

export function Process() {
  const { process } = useLanding();
  const reduced = useReducedMotion();
  const gridRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start 85%", "end 60%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 70, damping: 24 });

  return (
    <section className={s.section} id="process">
      <div className={s.sectionGlow} aria-hidden="true" />
      <div className={`${s.container} ${styles.inner}`}>
        <Reveal className={styles.head}>
          <div className={s.taglineRow}>
            <p className={s.tagline}>{process.tagline}</p>
            <span className={s.taglineLine} aria-hidden="true" />
          </div>
          <div className={styles.headRow}>
            <h2 className={`${s.h2} ${styles.h2}`}>
              <span className={s.dim}>{process.dim}</span>
              <span className={s.bright}>
                {process.bright} <span className={s.textGradient}>{process.brightAccent}</span>
              </span>
            </h2>
            <p className={`${s.bodyMuted} ${styles.lead}`}>{process.lead}</p>
          </div>
        </Reveal>

        <ol className={styles.steps} ref={gridRef}>
          <span className={styles.track} aria-hidden="true">
            <motion.span className={styles.trackFill} style={reduced ? undefined : { scaleX: draw }} />
          </span>
          {process.steps.map((p, i) => (
            <li key={p.step} className={styles.step}>
              <Reveal delay={0.07 * i} className={styles.stepInner}>
                <span className={styles.node} aria-hidden="true">
                  <span className={styles.nodeNum}>{p.step}</span>
                </span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.body}>{p.body}</p>
                <p className={styles.output}>
                  <span>Output</span> {p.output}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className={styles.includes}>
          {process.includes.map((x) => (
            <span key={x}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="m5 12 5 5L20 7" />
              </svg>
              {x}
            </span>
          ))}
          <em className={s.hand}>all included when we work together</em>
        </Reveal>
      </div>
    </section>
  );
}
