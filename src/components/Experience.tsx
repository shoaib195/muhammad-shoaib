"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { experience } from "@/lib/data";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { easeOut } from "@/lib/motion";
import styles from "./Experience.module.css";

export function Experience() {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <section
      id="experience"
      className={`section ${styles.section}`}
      aria-labelledby="experience-title"
    >
      <div className="section__inner">
        <Reveal>
          <p className="section__meta">Experience</p>
          <h2 id="experience-title" className={`display ${styles.heading}`}>
            A timeline of
            <br />
            <span className="serif">deliberate</span> work.
          </h2>
        </Reveal>

        <RevealGroup className={styles.timeline}>
          {experience.map((item, index) => {
            const isOpen = open === index;
            return (
              <RevealItem key={`${item.year}-${item.role}`}>
                <article className={`${styles.item} ${isOpen ? styles.open : ""}`}>
                  <button
                    type="button"
                    className={styles.trigger}
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    data-cursor="hover"
                  >
                    <span className={styles.year}>{item.year}</span>
                    <span className={styles.role}>{item.role}</span>
                    <span className={styles.company}>{item.company}</span>
                    <span className={styles.chevron} aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className={styles.impactWrap}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: easeOut }}
                      >
                        <p className={styles.impact}>{item.impact}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
