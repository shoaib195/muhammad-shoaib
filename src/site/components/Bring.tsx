"use client";

import { useLanding } from "../cms/CmsProvider";
import { Reveal } from "./Reveal";
import styles from "./Bring.module.css";
import s from "../Site.module.css";

const icons = [
  // product thinking
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
  </svg>,
  // engineering discipline
  <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="m16 18 6-6-6-6M8 6l-6 6 6 6M14 4l-4 16" />
  </svg>,
  // interface quality
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M3 9h18M8 21h8" />
  </svg>,
  // performance
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
  </svg>,
];

export function Bring() {
  const { bring } = useLanding();

  return (
    <section className={s.section} id="bring">
      <div className={s.sectionGlow} aria-hidden="true" />
      <div className={`${s.container} ${styles.inner}`}>
        <Reveal className={styles.head}>
          <div className={s.taglineRow}>
            <p className={s.tagline}>{bring.tagline}</p>
            <span className={s.taglineLine} aria-hidden="true" />
          </div>
          <h2 className={s.h2}>
            <span className={s.dim}>{bring.dim}</span>
            <span className={s.bright}>
              {bring.bright} <span className={s.textGradient}>{bring.brightAccent}</span>
            </span>
          </h2>
          <p className={`${s.bodyMuted} ${styles.lead}`}>{bring.lead}</p>
        </Reveal>

        <div className={styles.grid}>
          {bring.items.map((b, i) => (
            <Reveal key={b.title} delay={0.06 * i} className={`${s.card} ${s.cardHover} ${styles.card}`}>
              <span className={styles.idx}>0{i + 1}</span>
              <span className={styles.icon}>{icons[i]}</span>
              <h3 className={styles.title}>{b.title}</h3>
              <p className={styles.body}>{b.body}</p>
              <span className={styles.detail}>{b.detail}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
