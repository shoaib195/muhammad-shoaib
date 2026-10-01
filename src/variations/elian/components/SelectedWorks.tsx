"use client";

import Image from "next/image";
import { selectedWorks } from "../data";
import { Reveal } from "./Reveal";
import styles from "./SelectedWorks.module.css";

export function SelectedWorks() {
  return (
    <section className={styles.section} id="works" aria-labelledby="elian-works">
      <Reveal>
        <div className={styles.header}>
          <p className={styles.kicker}>/ Best Projects</p>
          <h2 id="elian-works" className={styles.title}>
            Selected <span className={styles.italic}>Works</span>
          </h2>
        </div>
      </Reveal>

      <div className={styles.grid}>
        {selectedWorks.map((work, i) => (
          <Reveal key={work.id} delay={(i % 2) * 0.06}>
            <article className={styles.card}>
              <div className={styles.media}>
                <Image
                  src={work.image}
                  alt={`${work.title} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.img}
                />
              </div>
              <div className={styles.meta}>
                <h3 className={styles.name}>{work.title}</h3>
                <ul className={styles.tags}>
                  {work.tags.map((tag) => (
                    <li key={tag}>
                      <span className={styles.tag}>{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
