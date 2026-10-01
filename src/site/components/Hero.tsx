"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "../data";
import { ArcText } from "./ArcText";
import styles from "./Hero.module.css";
import s from "../Site.module.css";

const avatars = [
  "/v2/avatars/a1.jpg",
  "/v2/avatars/a2.jpg",
  "/v2/avatars/a3.jpg",
  "/v2/avatars/a4.jpg",
];

const features = [
  {
    label: "Architecture-first",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="16" y="16" width="6" height="6" rx="1" />
        <rect x="2" y="16" width="6" height="6" rx="1" />
        <rect x="9" y="2" width="6" height="6" rx="1" />
        <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
        <path d="M12 12V8" />
      </svg>
    ),
  },
  {
    label: "Project-driven builds",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5" />
        <circle cx="13" cy="12" r="2" />
        <path d="M18 19c-2.8 0-5-2.2-5-5v8" />
        <circle cx="20" cy="19" r="2" />
      </svg>
    ),
  },
  {
    label: "AI-assisted workflows",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
];

const trustItems = [
  {
    label: "Open to new opportunities",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Available for freelance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    label: "Open to collaborations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export function Hero() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const portrait = portraitRef.current;
    if (!hero || !portrait || reduced) return;

    let raf = 0;
    const onMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const box = hero.getBoundingClientRect();
        const px = ((clientX - box.left) / box.width - 0.5) * 2;
        const py = ((clientY - box.top) / box.height - 0.5) * 2;
        portrait.style.setProperty("--px", px.toFixed(3));
        portrait.style.setProperty("--py", py.toFixed(3));
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      portrait.style.setProperty("--px", "0");
      portrait.style.setProperty("--py", "0");
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <section id="top" ref={heroRef} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.gridPattern} aria-hidden="true" />

      {/* Portrait — full-height right, left-edge fade into page */}
      <div className={styles.portraitWrap} ref={portraitRef} aria-hidden="true">
        <div className={styles.portraitSharp}>
          <Image
            src="/v2/hero-portrait-full.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className={styles.portraitImgCover}
          />
        </div>
        <div className={styles.mobileFadeTop} />
        <div className={styles.mobileFadeBottom} />
      </div>

      {/* Handwriting — sits in the portrait's left fade zone, not over the face */}
      <motion.div
        className={styles.handIntro}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <ArcText
          className={styles.handSvg}
          lines={[`Hi, I'm ${site.firstName}.`, "Shipping interfaces that", "hold up in production."]}
          width={380}
          lineHeight={42}
          fontSize={36}
          bend={26}
          align="start"
        />
        <svg className={styles.handArrow} viewBox="0 0 90 70" fill="none" aria-hidden="true">
          <motion.path
            d="M8 6 C 6 38, 32 58, 82 62"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d="M64 48 L 80 58 L 66 66"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.4 }}
          />
        </svg>
      </motion.div>

      <div className={styles.shell}>
        <div className={styles.copy}>
          <motion.div
            className={styles.proof}
            initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
          >
            <svg className={styles.scribble} viewBox="0 0 30 60" fill="currentColor" aria-hidden="true">
              <path d="M14.1 9.4C16.9 9.1 19.6 5.9 19.2 1.6C15.2 2.2 12.7 6.6 14.1 9.4Z" />
              <path d="M9.8 15C11.3 13.9 12.9 9 9.6 5.5C5.4 8.7 8.2 14.2 9.8 15Z" />
              <path d="M8.5 23.3C9.3 21.7 9 16.1 4 15C1.9 19.2 6.6 23.2 8.5 23.3Z" />
              <path d="M8.8 32.5C9.1 30.6 6.9 24.8 1.8 25.4C1.1 30 6.3 32.9 8.8 32.5Z" />
              <path d="M11.9 41.4C11.7 39.5 7.8 34.1 2.5 35C3 41.4 10.1 42 11.9 41.4Z" />
              <path d="M17.6 49.6C17 47.5 11 42.2 5.1 43.8C7.3 50.4 15.6 50.5 17.6 49.6Z" />
              <path d="M24.9 56.6C23.8 54.7 17.1 50.7 11.7 53.6C14.4 58.3 21.4 58.8 24.9 56.6Z" />
            </svg>

            <span className={styles.proofPill}>
              <span className={styles.avatarStack}>
                {avatars.map((src) => (
                  <Image key={src} src={src} alt="" width={48} height={48} className={styles.avatar} />
                ))}
              </span>
              7+ years shipping products
              <span className={`${s.badge} ${styles.pillBadge}`}>
                <span className={s.badgeDot} />
                Available for work
              </span>
              <span className={styles.rating}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                </svg>
                4.9
              </span>
            </span>

            <svg className={`${styles.scribble} ${styles.scribbleFlip}`} viewBox="0 0 30 60" fill="currentColor" aria-hidden="true">
              <path d="M14.1 9.4C16.9 9.1 19.6 5.9 19.2 1.6C15.2 2.2 12.7 6.6 14.1 9.4Z" />
              <path d="M9.8 15C11.3 13.9 12.9 9 9.6 5.5C5.4 8.7 8.2 14.2 9.8 15Z" />
              <path d="M8.5 23.3C9.3 21.7 9 16.1 4 15C1.9 19.2 6.6 23.2 8.5 23.3Z" />
              <path d="M8.8 32.5C9.1 30.6 6.9 24.8 1.8 25.4C1.1 30 6.3 32.9 8.8 32.5Z" />
              <path d="M11.9 41.4C11.7 39.5 7.8 34.1 2.5 35C3 41.4 10.1 42 11.9 41.4Z" />
              <path d="M17.6 49.6C17 47.5 11 42.2 5.1 43.8C7.3 50.4 15.6 50.5 17.6 49.6Z" />
              <path d="M24.9 56.6C23.8 54.7 17.1 50.7 11.7 53.6C14.4 58.3 21.4 58.8 24.9 56.6Z" />
            </svg>
          </motion.div>

          <motion.h1
            id="hero-title"
            className={styles.title}
            initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            Building Production-Grade
            <br />
            <span className={styles.titleAccent}>Frontend Products.</span>
          </motion.h1>

          <motion.p
            className={styles.lead}
            initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.75 }}
          >
            Build the skills companies expect from strong frontend engineers —
            from React architecture and performance to scalable, production-ready systems.
          </motion.p>

          <motion.ul
            className={styles.features}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65 }}
          >
            {features.map((f) => (
              <li key={f.label}>
                <span className={styles.featureIcon}>{f.icon}</span>
                {f.label}
              </li>
            ))}
          </motion.ul>

          <motion.div
            className={styles.ctas}
            initial={reduced ? false : { opacity: 0, y: 16, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <a href="#contact" className={styles.btnPrimary}>
              Let&apos;s work together
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a href="#works" className={styles.btnGhost}>
              View selected work
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </a>
          </motion.div>

          <motion.ul
            className={styles.trust}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.52, duration: 0.6 }}
          >
            {trustItems.map((t) => (
              <li key={t.label}>
                <span className={styles.trustIcon}>{t.icon}</span>
                {t.label}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

    </section>
  );
}
