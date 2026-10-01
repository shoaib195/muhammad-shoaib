"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/data";
import { easeOut } from "@/lib/motion";
import styles from "./Hero.module.css";

export function Hero() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    if (!stage) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      stage.style.setProperty("--px", `${x}`);
      stage.style.setProperty("--py", `${y}`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  return (
    <section
      id="top"
      ref={stageRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.parallaxGlow} aria-hidden="true" />

      <div className={styles.inner}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.lineMask}>
            <motion.span
              className={styles.wordCreative}
              initial={reduced ? false : { y: "120%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 1.05, ease: easeOut, delay: 0.45 }}
            >
              Creative
            </motion.span>
          </span>

          <span className={styles.lineRow}>
            <span className={styles.lineMask}>
              <motion.span
                className={styles.wordVisualWrap}
                initial={reduced ? false : { y: "120%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1.05, ease: easeOut, delay: 0.62 }}
              >
                <span className={`serif ${styles.wordVisual}`}>visual</span>
              </motion.span>
            </span>
            <span className={styles.lineMask}>
              <motion.span
                className={styles.wordDesigner}
                initial={reduced ? false : { y: "120%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1.1, ease: easeOut, delay: 0.78 }}
              >
                designer
              </motion.span>
            </span>
          </span>
        </h1>

        <motion.div
          className={styles.footer}
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: easeOut, delay: 1.05 }}
        >
          <div className={styles.metaLeft}>
            <p>{site.disciplines}</p>
            <p>{site.availability}</p>
          </div>
          <div className={styles.metaCenter}>
            <p>{site.location}</p>
          </div>
          <a href="#work" className={styles.scroll} data-cursor="hover" aria-label="Scroll to work">
            <span className={styles.scrollArrow} aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
