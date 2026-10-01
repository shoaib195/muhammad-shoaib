import Image from "next/image";
import type { Project } from "./projects";
import { SmartLink } from "./components/SmartLink";
import styles from "./ProjectDetail.module.css";
import s from "./Site.module.css";

type Props = { project: Project };

export function ProjectDetail({ project }: Props) {
  const live = project.links?.live;

  return (
    <main className={`${s.main} ${styles.main}`}>
      <section className={`${s.section} ${styles.section}`}>
        <div className={`${s.container} ${styles.inner}`}>
          <SmartLink href="/work" className={styles.back}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All projects
          </SmartLink>

          <div className={styles.layout}>
            <div className={styles.media}>
              <Image
                src={project.cover}
                alt=""
                fill
                priority
                sizes="(max-width: 900px) 100vw, 48vw"
                className={styles.cover}
              />
            </div>

            <div className={styles.copy}>
              <p className={styles.meta}>
                {project.platform}
                {project.status ? ` · ${project.status}` : ""}
              </p>
              <h1 className={styles.title}>{project.name}</h1>
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
                <SmartLink href="/work" className={`${s.btn} ${s.btnSecondary}`}>
                  Back to work
                </SmartLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
