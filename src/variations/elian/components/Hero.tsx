"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "../data";
import { Reveal } from "./Reveal";
import styles from "./Hero.module.css";

export function Hero() {
  const reduced = useReducedMotion();
  const [src, setSrc] = useState("/v2/elian-cutout.png");

  return (
    <section className={styles.hero} id="top" aria-labelledby="elian-hero-title">
      <div className={styles.inner}>
        <Reveal className={styles.intro}>
          <p className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            {site.badge}
          </p>
          <p className={styles.hi}>
            Hi I&apos;m <em>{site.firstName}</em>
          </p>
          <h1 id="elian-hero-title" className={styles.title}>
            {site.roleTitle}
          </h1>
        </Reveal>

        <div className={styles.stage}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.glowSoft} aria-hidden="true" />

          <motion.div
            className={styles.avail}
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className={styles.dot} aria-hidden="true" />
            {site.availability}
          </motion.div>

          <motion.p
            className={styles.aside}
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          >
            {site.philosophy}
          </motion.p>

          <div className={styles.portrait}>
            <Image
              src={src}
              alt="Portrait of Muhammad Shoaib"
              width={640}
              height={820}
              priority
              className={styles.portraitImg}
              onError={() => setSrc("/v2/try-2.png")}
            />
          </div>

          <div className={styles.proof}>
            <p className={styles.proofStat}>7+</p>
            <p>{site.clientsTrusted}</p>
          </div>

          <div className={styles.ctaGroup}>
            <a
              href={site.resumeUrl}
              download={site.resumeFileName}
              className={styles.cta}
            >
              Download Resume
              <span aria-hidden="true">↓</span>
            </a>
            <a href="#contact" className={styles.ctaGhost}>
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
