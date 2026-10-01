"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../projects";
import styles from "./ProjectModal.module.css";
import s from "../Site.module.css";

type Props = { project: Project | null; onClose: () => void };

export function ProjectModal({ project, onClose }: Props) {
  const [active, setActive] = useState(0);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setRoot(document.getElementById("ms-modal-root"));
  }, []);

  useEffect(() => {
    if (!project) return;
    setActive(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [project, onClose]);

  if (!root) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            className={styles.dialog}
            initial={{ opacity: 0, y: 28, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close project details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className={styles.media}>
              <div className={styles.cover}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={project.images[active]}
                    className={styles.coverImgWrap}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Image src={project.images[active]} alt={`${project.name} screenshot ${active + 1}`} fill sizes="(max-width: 900px) 100vw, 60vw" className={styles.coverImg} />
                  </motion.div>
                </AnimatePresence>
                <div className={styles.coverMeta}>
                  <span className={`${s.badge} ${styles.platform}`}>
                    {project.platform === "Mobile" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                        <path d="M12 18h.01" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect width="20" height="14" x="2" y="3" rx="2" />
                        <path d="M8 21h8M12 17v4" />
                      </svg>
                    )}
                    {project.platform}
                  </span>
                  {project.status && (
                    <span className={`${s.badge} ${project.status === "Currently building" ? s.badgeAccent : ""}`}>
                      <span className={s.badgeDot} />
                      {project.status}
                    </span>
                  )}
                </div>
              </div>
              {project.images.length > 1 && (
                <div className={styles.thumbs} role="tablist" aria-label="Screenshots">
                  {project.images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      className={`${styles.thumb} ${i === active ? styles.thumbActive : ""}`}
                      onClick={() => setActive(i)}
                    >
                      <Image src={img} alt="" width={160} height={90} className={styles.thumbImg} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.body}>
              <p className={s.tagline}>
                {project.company} · {project.period}
              </p>
              <h3 id="project-title" className={styles.title}>
                {project.name}
              </h3>
              <p className={styles.tagline}>{project.tagline}</p>

              <div className={styles.section}>
                <h4>Overview</h4>
                <p>{project.overview}</p>
              </div>

              <div className={styles.section}>
                <h4>What it does</h4>
                <p>{project.what}</p>
              </div>

              <div className={styles.section}>
                <h4>My role</h4>
                <ul>
                  {project.role.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.section}>
                  <h4>Key features</h4>
                  <ul>
                    {project.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                {project.impact && (
                  <div className={styles.section}>
                    <h4>Impact</h4>
                    <ul>
                      {project.impact.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.section}>
                <h4>Technologies</h4>
                <ul className={styles.tech}>
                  {project.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.links}>
                {project.links?.live ? (
                  <a href={project.links.live} target="_blank" rel="noreferrer" className={`${s.btn} ${s.btnPrimary}`}>
                    Live project
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 7h10v10M7 17 17 7" />
                    </svg>
                  </a>
                ) : null}
                {project.links?.source ? (
                  <a href={project.links.source} target="_blank" rel="noreferrer" className={`${s.btn} ${s.btnSecondary}`}>
                    Source
                  </a>
                ) : null}
                {!project.links?.live && !project.links?.source && (
                  <p className={styles.nda}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Client project under NDA — walkthrough available on request.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    root,
  );
}
