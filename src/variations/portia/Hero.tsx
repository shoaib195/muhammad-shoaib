"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "./data";
import { easeOut, scaleIn } from "./motion";
import styles from "./Hero.module.css";

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-name">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <motion.p
            className={styles.role}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
          >
            {site.role}
          </motion.p>

          <motion.p
            className={styles.tagline}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.28 }}
          >
            {site.tagline}
          </motion.p>

          <h1 id="hero-name" className={styles.name}>
            <motion.span
              initial={reduced ? false : { opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: easeOut, delay: 0.4 }}
            >
              PORTIA
            </motion.span>
            <motion.span
              initial={reduced ? false : { opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: easeOut, delay: 0.55 }}
            >
              WILLSON
            </motion.span>
          </h1>
        </div>

        <div className={styles.visual}>
          <div className={styles.glow} aria-hidden="true" />
          <motion.div
            className={styles.orangeRing}
            aria-hidden="true"
            variants={scaleIn}
            initial={reduced ? false : "hidden"}
            animate="visible"
          />
          <motion.div
            className={styles.portraitWrap}
            initial={reduced ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: easeOut, delay: 0.35 }}
          >
            <Image
              src="/v1/portrait.jpg"
              alt="Portrait of Portia Willson"
              fill
              priority
              sizes="(max-width: 960px) 78vw, 26rem"
              className={styles.portrait}
            />
          </motion.div>

          <motion.a
            href="#contact"
            className={styles.hireBadge}
            initial={reduced ? false : { opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.75 }}
            whileHover={reduced ? undefined : { scale: 1.08, rotate: -14 }}
          >
            HIRE
            <br />
            ME
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
