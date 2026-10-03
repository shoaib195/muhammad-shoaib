"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "./projects";
import { SmartLink } from "./components/SmartLink";
import { Reveal } from "./components/Reveal";
import styles from "./ProjectDetail.module.css";
import s from "./Site.module.css";

type Props = { project: Project };

export function ProjectDetail({ project }: Props) {
  const live = project.links?.live;
  const source = project.links?.source;
  const slides = useMemo(() => {
    const list = [project.cover, ...(project.images || [])].filter(Boolean);
    return Array.from(new Set(list));
  }, [project.cover, project.images]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [project.id]);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const go = (dir: -1 | 1) => {
    setActive((i) => (i + dir + slides.length) % slides.length);
  };

  return (
    <main className={`${s.main} ${styles.main}`}>
      <section className={`${s.section} ${styles.hero}`}>
        <div className={`${s.container} ${styles.inner}`}>
          <SmartLink href="/work" className={styles.back}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All projects
          </SmartLink>

          <div className={styles.layout}>
            <div className={styles.gallery}>
              <div className={styles.stage}>
                {slides.map((src, i) => (
                  <div key={src} className={`${styles.slide} ${i === active ? styles.slideActive : ""}`} aria-hidden={i !== active}>
                    <Image
                      src={src}
                      alt={`${project.name} screenshot ${i + 1}`}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 900px) 100vw, 52vw"
                      className={styles.cover}
                    />
                  </div>
                ))}

                {slides.length > 1 ? (
                  <>
                    <button type="button" className={`${styles.navBtn} ${styles.prev}`} onClick={() => go(-1)} aria-label="Previous image">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button type="button" className={`${styles.navBtn} ${styles.next}`} onClick={() => go(1)} aria-label="Next image">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                    <div className={styles.dots} role="tablist" aria-label="Project images">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          role="tab"
                          aria-selected={i === active}
                          className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                          onClick={() => setActive(i)}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              {slides.length > 1 ? (
                <div className={styles.thumbs}>
                  {slides.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      className={`${styles.thumb} ${i === active ? styles.thumbActive : ""}`}
                      onClick={() => setActive(i)}
                      aria-label={`Show image ${i + 1}`}
                    >
                      <Image src={src} alt="" fill sizes="96px" className={styles.thumbImg} />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className={styles.copy}>
              <p className={styles.meta}>
                {project.platform}
                {project.status ? ` · ${project.status}` : ""}
                {project.period ? ` · ${project.period}` : ""}
              </p>
              <h1 className={styles.title}>{project.name}</h1>
              {project.tagline ? <p className={styles.tagline}>{project.tagline}</p> : null}
              <p className={styles.description}>{project.overview}</p>

              <div className={styles.block}>
                <h2 className={styles.label}>Tech stack</h2>
                <ul className={styles.tech}>
                  {project.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.actions}>
                {live ? (
                  <a href={live} target="_blank" rel="noreferrer" className={`${s.btn} ${s.btnPrimary}`}>
                    View project
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </a>
                ) : (
                  <SmartLink href="/#contact" className={`${s.btn} ${s.btnPrimary}`}>
                    Request a walkthrough
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </SmartLink>
                )}
                {source ? (
                  <a href={source} target="_blank" rel="noreferrer" className={`${s.btn} ${s.btnSecondary}`}>
                    Source
                  </a>
                ) : null}
                <SmartLink href="/work" className={`${s.btn} ${s.btnSecondary}`}>
                  Back to work
                </SmartLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {(project.challenge || project.what) && (
        <section className={styles.band}>
          <div className={`${s.container} ${styles.bandInner}`}>
            {project.challenge ? (
              <Reveal className={styles.panel}>
                <p className={styles.label}>Challenge</p>
                <h2 className={styles.panelTitle}>The problem</h2>
                <p className={styles.panelBody}>{project.challenge}</p>
              </Reveal>
            ) : null}
            {project.what ? (
              <Reveal className={styles.panel} delay={0.06}>
                <p className={styles.label}>Solution</p>
                <h2 className={styles.panelTitle}>What we built</h2>
                <p className={styles.panelBody}>{project.what}</p>
              </Reveal>
            ) : null}
          </div>
        </section>
      )}

      {project.features?.length ? (
        <section className={`${s.section} ${styles.sectionPad}`}>
          <div className={`${s.container} ${styles.featuresWrap}`}>
            <Reveal>
              <p className={styles.label}>Product</p>
              <h2 className={styles.sectionTitle}>Key features</h2>
            </Reveal>
            <ul className={styles.featureGrid}>
              {project.features.map((f, i) => (
                <li key={f}>
                  <Reveal delay={0.04 * i} className={styles.featureCard}>
                    <span className={styles.featureIdx}>{String(i + 1).padStart(2, "0")}</span>
                    <p>{f}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {project.role?.length ? (
        <section className={styles.bandAlt}>
          <div className={`${s.container} ${styles.roleWrap}`}>
            <Reveal>
              <p className={styles.label}>Contribution</p>
              <h2 className={styles.sectionTitle}>My role</h2>
            </Reveal>
            <ul className={styles.roleList}>
              {project.role.map((r) => (
                <li key={r}>
                  <span className={styles.roleDot} aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className={styles.ctaBand}>
        <div className={`${s.container} ${styles.ctaInner}`}>
          <div>
            <h2 className={styles.ctaTitle}>Want something like this?</h2>
            <p className={styles.ctaBody}>Tell me about the product — I&apos;ll help scope the frontend and ship it cleanly.</p>
          </div>
          <SmartLink href="/#contact" className={`${s.btn} ${s.btnPrimary}`}>
            Let&apos;s talk
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </SmartLink>
        </div>
      </section>
    </main>
  );
}
