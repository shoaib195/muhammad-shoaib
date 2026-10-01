"use client";

import Image from "next/image";
import { projects, type Project } from "../projects";
import { Reveal } from "./Reveal";
import { SmartLink } from "./SmartLink";
import styles from "./Showcase.module.css";
import s from "../Site.module.css";

const featured = projects.slice(0, 6);

export function Showcase() {
  return (
    <section className={`${s.section} ${styles.section}`} id="works">
      <div className={styles.glow} aria-hidden="true" />
      <div className={`${s.container} ${styles.inner}`}>
        <Reveal className={styles.head}>
          <div className={s.taglineRow}>
            <p className={s.tagline}>04 / Selected work</p>
            <span className={s.taglineLine} aria-hidden="true" />
            <span className={`${s.badge} ${s.badgeAccent}`}>
              <span className={s.badgeDot} />
              Available for new projects
            </span>
          </div>
          <div className={styles.headRow}>
            <h2 className={styles.h2}>
              <span className={s.textGradient}>30+</span> products <span className={styles.handTitle}>shipped.</span>
            </h2>
            <p className={styles.lead}>
              From early-stage startups to production systems used by real teams. Six of them, with the
              role I played, the stack and the outcome.{" "}
              <span className={styles.handNote}>Open a project for the details.</span>
            </p>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={0.05 * (i % 3)} className={styles.cell}>
              <article className={`${s.card} ${styles.card}`}>
                <SmartLink href={`/work/${p.id}`} className={styles.cardBtn} aria-label={`View project: ${p.name}`}>
                  <span className={styles.media}>
                    <Image
                      src={p.cover}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      className={styles.cover}
                    />
                    <span className={styles.mediaFade} aria-hidden="true" />
                    <span className={styles.kicker}>
                      0{i + 1} / {p.category}
                    </span>
                    {p.status === "Currently building" && (
                      <span className={`${s.badge} ${s.badgeAccent} ${styles.status}`}>
                        <span className={s.badgeDot} />
                        Currently building
                      </span>
                    )}
                  </span>

                  <span className={styles.body}>
                    <span className={styles.title}>{p.tagline}</span>
                    <span className={styles.name}>{p.name}</span>

                    <span className={styles.rows}>
                      <span className={styles.row}>
                        <span className={styles.rowKey}>My role</span>
                        <span className={styles.rowVal}>{roleLine(p)}</span>
                      </span>
                      <span className={styles.row}>
                        <span className={styles.rowKey}>Stack</span>
                        <span className={styles.rowVal}>{p.tech.slice(0, 4).join(" · ")}</span>
                      </span>
                      <span className={styles.row}>
                        <span className={styles.rowKey}>Challenge</span>
                        <span className={styles.rowVal}>{p.challenge}</span>
                      </span>
                      {p.impact?.[0] && (
                        <span className={styles.row}>
                          <span className={styles.rowKey}>Result</span>
                          <span className={`${styles.rowVal} ${styles.result}`}>{p.impact[0]}</span>
                        </span>
                      )}
                    </span>

                    <span className={styles.cta}>
                      View project
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </span>
                </SmartLink>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.foot}>
          <p className={s.bodyMuted}>Thirty-plus products across CRMs, dashboards, mobile apps and storefronts.</p>
          <SmartLink href="/work" className={`${s.btn} ${s.btnSecondary}`}>
            View all projects
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </SmartLink>
        </Reveal>
      </div>
    </section>
  );
}

function roleLine(p: Project) {
  switch (p.platform) {
    case "Mobile":
      return "React Native engineering, end-to-end";
    default:
      return p.id === "ai-workflows" ? "AI feature design + frontend integration" : "Frontend architecture + UI engineering";
  }
}
