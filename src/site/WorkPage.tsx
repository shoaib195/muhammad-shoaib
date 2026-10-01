"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { projects } from "./projects";
import { SmartLink } from "./components/SmartLink";
import { Reveal } from "./components/Reveal";
import styles from "./WorkPage.module.css";
import s from "./Site.module.css";

type Filter = "All" | "Web" | "Mobile";
const filters: Filter[] = ["All", "Web", "Mobile"];

const ease = [0.22, 1, 0.36, 1] as const;

export function WorkPage() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");

  const list = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.platform.includes(filter))),
    [filter],
  );

  const counts = useMemo(
    () => ({
      All: projects.length,
      Web: projects.filter((p) => p.platform.includes("Web")).length,
      Mobile: projects.filter((p) => p.platform.includes("Mobile")).length,
    }),
    [],
  );

  return (
    <main className={`${s.main} ${styles.main}`} id="work-top">
      <section className={`${s.section} ${styles.hero}`}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={`${s.container} ${styles.heroInner}`}>
          <Reveal>
            <div className={s.taglineRow}>
              <p className={s.tagline}>Work / All projects</p>
              <span className={`${s.badge} ${s.badgeAccent}`}>
                <span className={s.badgeDot} />
                Available for new projects
              </span>
            </div>
            <h1 className={styles.title}>
              <span className={s.dim}>Every product I&apos;ve shipped,</span>
              <span className={s.bright}>
                in one <span className={s.textGradient}>place.</span>
              </span>
            </h1>
            <p className={`${s.bodyMuted} ${styles.lead}`}>
              CRMs, dashboards, React Native apps, AI-assisted internal tools and storefronts — built for
              real teams over 7+ years. Open any card for the title, overview, stack and project link.
            </p>
          </Reveal>

          <Reveal delay={0.08} className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>30+</span>
              <span className={styles.statLabel}>products shipped</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>7+</span>
              <span className={styles.statLabel}>years experience</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>4</span>
              <span className={styles.statLabel}>teams &amp; companies</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={`${s.section} ${styles.gridSection}`}>
        <div className={s.container}>
          <Reveal className={styles.toolbar}>
            <LayoutGroup id="work-filters">
              <div className={styles.filters} role="tablist" aria-label="Filter projects by platform">
                {filters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    role="tab"
                    aria-selected={filter === f}
                    className={`${styles.filter} ${filter === f ? styles.filterActive : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {filter === f && (
                      <motion.span
                        layoutId="work-filter-pill"
                        className={styles.filterPill}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className={styles.filterLabel}>
                      {f} <span className={styles.filterCount}>{counts[f]}</span>
                    </span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
            <p className={styles.hint}>
              <span className={s.hand}>open a project for details</span> ↓
            </p>
          </Reveal>

          <motion.ul className={styles.grid} layout>
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.55, ease, delay: Math.min(i * 0.05, 0.3) }}
                >
                  <SmartLink href={`/work/${p.id}`} className={`${s.card} ${styles.card}`} aria-label={`View project: ${p.name}`}>
                    <span className={styles.media}>
                      <Image
                        src={p.cover}
                        alt=""
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        className={styles.cover}
                      />
                      <span className={styles.mediaFade} aria-hidden="true" />
                      <span className={styles.mediaMeta}>
                        <span className={`${s.badge} ${styles.platform}`}>{p.platform}</span>
                        {p.status && (
                          <span className={`${s.badge} ${p.status === "Currently building" ? s.badgeAccent : ""}`}>
                            <span className={s.badgeDot} />
                            {p.status}
                          </span>
                        )}
                      </span>
                    </span>

                    <span className={styles.body}>
                      <span className={styles.meta}>
                        {p.company} · {p.period}
                      </span>
                      <span className={styles.name}>{p.name}</span>
                      <span className={styles.tagline}>{p.tagline}</span>
                      <span className={styles.tech}>
                        {p.tech.slice(0, 4).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                        {p.tech.length > 4 && <span className={styles.techMore}>+{p.tech.length - 4}</span>}
                      </span>
                    </span>

                    <span className={styles.arrow} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 7h10v10M7 17 17 7" />
                      </svg>
                    </span>
                  </SmartLink>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </section>

      <section className={`${s.section} ${styles.ctaSection}`}>
        <div className={s.sectionGlow} aria-hidden="true" />
        <div className={`${s.container} ${styles.cta}`}>
          <Reveal>
            <h2 className={`${s.h2} ${styles.ctaTitle}`}>
              <span className={s.dim}>Have something to build?</span>
              <span className={s.bright}>
                Let&apos;s ship it <span className={s.textGradient}>properly.</span>
              </span>
            </h2>
            <div className={styles.ctaRow}>
              <SmartLink href="/#contact" className={`${s.btn} ${s.btnPrimary}`}>
                Get in touch
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </SmartLink>
              <SmartLink href="/#about" className={`${s.btn} ${s.btnSecondary}`}>
                See experience
              </SmartLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
