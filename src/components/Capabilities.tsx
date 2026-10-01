"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { capabilities } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { easeOut } from "@/lib/motion";
import styles from "./Capabilities.module.css";

export function Capabilities() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  return (
    <section
      id="capabilities"
      className={`section ${styles.section}`}
      aria-labelledby="capabilities-title"
    >
      <div className="section__inner">
        <Reveal>
          <p className="section__meta">Capabilities</p>
          <div className={styles.header}>
            <h2 id="capabilities-title" className={`display ${styles.heading}`}>
              What I
              <br />
              <span className="serif">create</span>
            </h2>
            <p className={styles.note}>
              Hover a capability to expand the brief. On touch devices, tap to
              reveal.
            </p>
          </div>
        </Reveal>

        <Reveal className={styles.layout}>
          <ul className={styles.list} role="list">
            {capabilities.map((item, index) => {
              const isActive = active === index;
              return (
                <li key={item.number}>
                  <button
                    type="button"
                    className={`${styles.row} ${isActive ? styles.active : ""}`}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    data-cursor="hover"
                    aria-expanded={isActive}
                  >
                    <span className={styles.number}>{item.number}</span>
                    <span className={styles.title}>{item.title}</span>
                    <span className={styles.indicator} aria-hidden="true">
                      {isActive ? "—" : "+"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={styles.panel} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={capabilities[active].number}
                className={styles.panelInner}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: easeOut }}
              >
                <p className={styles.panelNumber}>{capabilities[active].number}</p>
                <h3 className={styles.panelTitle}>{capabilities[active].title}</h3>
                <p className={styles.panelBody}>{capabilities[active].description}</p>
                <div className={styles.panelVisual} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
