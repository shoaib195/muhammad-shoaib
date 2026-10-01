"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { projects, type Project } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import styles from "./Work.module.css";

function ProjectVisual({ project }: { project: Project }) {
  return (
    <div className={styles.visual} data-layout={project.layout}>
      <div className={styles.visualGlow} aria-hidden="true" />
      <div className={styles.visualRing} aria-hidden="true" />
      <div className={styles.visualPanel} aria-hidden="true">
        <span>{project.number}</span>
        <span>{project.title}</span>
      </div>
      <div className={styles.visualBars} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className={styles.meta}>
      <div className={styles.metaTop}>
        <span className={styles.number}>{project.number}</span>
        <span className={styles.year}>{project.year}</span>
      </div>
      <p className={styles.category}>{project.category}</p>
      <h3 className={`display ${styles.title}`}>{project.title}</h3>
      <p className={styles.description}>{project.description}</p>
      <ul className={styles.tech}>
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <a href={`#${project.id}`} className={styles.link} data-cursor="hover">
        View case study
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [36, -36]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reduced ? [1, 1, 1] : [0.97, 1, 0.99]
  );

  return (
    <article
      ref={ref}
      id={project.id}
      className={styles.project}
      data-layout={project.layout}
    >
      <motion.div className={styles.media} style={{ y, scale }}>
        <ProjectVisual project={project} />
      </motion.div>
      <Reveal className={styles.copy} delay={0.05 * (index % 3)}>
        <ProjectMeta project={project} />
      </Reveal>
    </article>
  );
}

export function Work() {
  return (
    <section id="work" className={`section ${styles.work}`} aria-labelledby="work-title">
      <div className="section__inner">
        <Reveal>
          <p className="section__meta">Playbook</p>
          <div className={styles.header}>
            <h2 id="work-title" className={`display ${styles.heading}`}>
              Selected
              <br />
              <span className="serif">work</span>
            </h2>
            <p className={styles.lede}>
              A curated set of product and brand experiences — each composition
              shaped by atmosphere, type, and motion.
            </p>
          </div>
        </Reveal>

        <div className={styles.list}>
          {projects.map((project, index) => (
            <ProjectBlock key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
