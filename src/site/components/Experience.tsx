"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { experience, site } from "../data";
import { experienceDetails } from "../content";
import { Reveal } from "./Reveal";
import styles from "./Experience.module.css";
import s from "../Site.module.css";

const initials = (name: string) =>
  name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export function Experience() {
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 70%"] });
  const grow = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section className={s.section} id="experience">
      <div className={s.sectionGlow} aria-hidden="true" />
      <div className={`${s.container} ${styles.inner}`}>
        <Reveal className={styles.head}>
          <div className={s.taglineRow}>
            <p className={s.tagline}>05 / Experience</p>
            <span className={s.taglineLine} aria-hidden="true" />
          </div>
          <div className={styles.headRow}>
            <h2 className={`${s.h2} ${styles.h2}`}>
              <span className={s.dim}>Seven years of shipping.</span>
              <span className={s.bright}>
                Four teams, real <span className={s.textGradient}>products.</span>
              </span>
            </h2>
            <div className={styles.headAside}>
              <p className={s.bodyMuted}>
                Frontend since 2018 — from static templates to CRMs, mobile apps and AI-assisted tools.
                Every role shipped to real users.
              </p>
              <a href={site.resumeUrl} download={site.resumeFileName} className={`${s.btn} ${s.btnSecondary}`}>
                Download resume
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </a>
            </div>
          </div>
        </Reveal>

        <ol className={styles.timeline} ref={listRef}>
          <span className={styles.rail} aria-hidden="true" />
          <motion.span
            className={`${styles.rail} ${styles.railActive}`}
            aria-hidden="true"
            style={reduced ? undefined : { scaleY: grow }}
          />

          {experience.map((e, i) => {
            const d = experienceDetails[e.company];
            const current = /present/i.test(e.years);
            return (
              <li key={e.company} className={styles.item}>
                <span className={`${styles.dot} ${current ? styles.dotActive : ""}`} aria-hidden="true" />
                <Reveal delay={0.04 * i} className={styles.itemInner}>
                  <div className={styles.when}>
                    <span className={styles.years}>{e.years}</span>
                    {current && (
                      <span className={`${s.badge} ${s.badgeAccent} ${styles.now}`}>
                        <span className={s.badgeDot} />
                        Current
                      </span>
                    )}
                  </div>

                  <div className={`${s.card} ${s.cardHover} ${styles.card}`}>
                    <div className={styles.cardHead}>
                      <span className={styles.tile}>{initials(e.company)}</span>
                      <div>
                        <h3 className={styles.role}>{e.role}</h3>
                        <p className={styles.company}>{e.company}</p>
                      </div>
                    </div>

                    {d?.summary && <p className={styles.summary}>{d.summary}</p>}

                    <div className={styles.cols}>
                      <div>
                        <p className={styles.key}>Responsibilities</p>
                        <ul className={styles.list}>
                          {e.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      </div>
                      {d?.outcomes?.length ? (
                        <div>
                          <p className={styles.key}>Outcomes</p>
                          <ul className={`${styles.list} ${styles.outcomes}`}>
                            {d.outcomes.map((o) => (
                              <li key={o}>{o}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>

                    {d?.stack?.length ? (
                      <ul className={styles.stack} aria-label="Technologies">
                        {d.stack.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
