"use client";

import Image from "next/image";
import { works } from "./data";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import styles from "./Works.module.css";

export function Works() {
  const left = works.filter((_, i) => i % 2 === 0);
  const right = works.filter((_, i) => i % 2 === 1);

  return (
    <section id="works" className={styles.works} aria-labelledby="works-title">
      <div className={styles.inner}>
        <Reveal className={styles.header}>
          <div>
            <p className={styles.eyebrow}>SELECTED PROJECTS</p>
            <h2 id="works-title" className={styles.title}>
              FEATURED WORKS
            </h2>
          </div>
          <a href="#works" className={styles.seeAll}>
            SEE ALL PROJECTS
          </a>
        </Reveal>

        <RevealGroup className={styles.grid}>
          <div className={styles.col}>
            {left.map((item) => (
              <RevealItem key={item.id}>
                <a href="#works" className={styles.card}>
                  <div
                    className={`${styles.media} ${item.tall ? styles.mediaTall : ""}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 800px) 100vw, 38vw"
                    />
                  </div>
                  <div className={styles.meta}>
                    <p className={styles.category}>{item.category}</p>
                    <h3 className={styles.projectTitle}>{item.title}</h3>
                  </div>
                </a>
              </RevealItem>
            ))}
          </div>

          <div className={`${styles.col} ${styles.colRight}`}>
            {right.map((item) => (
              <RevealItem key={item.id}>
                <a href="#works" className={styles.card}>
                  <div
                    className={`${styles.media} ${item.tall ? styles.mediaTall : ""}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 800px) 100vw, 38vw"
                    />
                  </div>
                  <div className={styles.meta}>
                    <p className={styles.category}>{item.category}</p>
                    <h3 className={styles.projectTitle}>{item.title}</h3>
                  </div>
                </a>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
