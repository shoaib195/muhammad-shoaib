"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLanding } from "../cms/CmsProvider";
import { Reveal } from "./Reveal";
import { ArcText } from "./ArcText";
import styles from "./Gap.module.css";
import s from "../Site.module.css";

export function Gap() {
  const { gap } = useLanding();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 55%"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const draw = useSpring(raw, { stiffness: 80, damping: 22, mass: 0.6 });

  return (
    <section className={`${s.section} ${styles.section}`} id="gap">
      <div className={s.sectionGlow} aria-hidden="true" />
      <div className={`${s.container} ${styles.inner}`} ref={ref}>
        <Reveal className={styles.head}>
          <div className={s.taglineRow}>
            <p className={s.tagline}>{gap.tagline}</p>
            <span className={s.taglineLine} aria-hidden="true" />
          </div>
          <h2 className={s.h2}>
            <span className={s.dim}>{gap.dim}</span>
            <span className={s.bright}>
              {gap.bright} <span className={s.textGradient}>{gap.brightAccent}</span>
            </span>
          </h2>
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.copy} delay={0.05}>
            <p className={s.body}>{gap.body}</p>
            <p className={s.bodyMuted}>
              {gap.bodyMutedBefore}{" "}
              <span className={s.underlineHand}>
                {gap.bodyMutedUnderline}
                <svg viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <motion.path
                    d="M2 8 C 40 2, 90 12, 130 6 S 180 2, 198 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    style={reduced ? undefined : { pathLength: draw }}
                  />
                </svg>
              </span>
              {gap.bodyMutedAfter}
            </p>
            <div className={styles.hand}>
              <ArcText
                className={styles.handSvg}
                lines={gap.handLines}
                width={300}
                lineHeight={40}
                fontSize={36}
                bend={8}
                align="start"
                fill="gradient"
              />
              <svg className={styles.handArrow} viewBox="0 0 90 70" fill="none" aria-hidden="true">
                <motion.path
                  d="M6 10 C 30 40, 60 50, 84 44"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={reduced ? undefined : { pathLength: draw }}
                />
                <motion.path
                  d="M74 36 L 85 44 L 73 52"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={reduced ? undefined : { pathLength: draw, opacity: draw }}
                />
              </svg>
              <span className={styles.arrowDown} aria-hidden="true">
                ↓
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className={styles.list}>
              {gap.items.map((it, i) => (
                <li key={it.label} className={styles.item}>
                  <span className={styles.num}>0{i + 1}</span>
                  <span className={styles.label}>{it.label}.</span>
                  <span className={styles.stack}>{it.stack}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
