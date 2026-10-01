"use client";

import Image from "next/image";
import { site } from "../data";
import { Reveal } from "./Reveal";
import styles from "./CTA.module.css";
import s from "../Site.module.css";

const avatars = ["/v2/avatars/a1.jpg", "/v2/avatars/a2.jpg", "/v2/avatars/a3.jpg", "/v2/avatars/a4.jpg"];

export function CTA() {
  return (
    <section className={styles.section} id="hire">
      <div className={styles.glow} aria-hidden="true" />
      <Reveal className={styles.inner}>
        <h2 className={styles.h2}>
          Stop shipping templates.
          <br />
          <span className={s.textGradient}>Start engineering products.</span>
        </h2>
        <p className={styles.lead}>
          One engineer covers the whole frontend: React, Next.js, React Native and whatever comes
          next. Ship at your pace, with someone who owns the result alongside you.
        </p>
        <div className={styles.ctaWrap}>
          <a href="#contact" className={styles.btn}>
            Let&apos;s work together
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
        <p className={styles.note}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>
            Reply within 24 hours. Prefer a file?{" "}
            <a href={site.resumeUrl} download={site.resumeFileName} className={styles.noteLink}>
              Download the resume
            </a>
          </span>
        </p>
        <div className={styles.social}>
          <span className={styles.avatars} aria-hidden="true">
            {avatars.map((a) => (
              <Image key={a} src={a} alt="" width={48} height={48} className={styles.avatar} />
            ))}
          </span>
          <span className={styles.socialText}>7+ years · 4 teams · 30+ products shipped</span>
        </div>
      </Reveal>
    </section>
  );
}
