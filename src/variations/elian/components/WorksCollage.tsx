"use client";

import Image from "next/image";
import { collageImages } from "../data";
import { Reveal } from "./Reveal";
import styles from "./WorksCollage.module.css";

export function WorksCollage() {
  return (
    <section className={styles.section} aria-label="Works preview">
      <Reveal>
        <div className={styles.panel}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.collage}>
            {collageImages.map((img, i) => (
              <figure
                key={img.src}
                className={`${styles.card} ${styles[`card${i + 1}`]}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 45vw, 280px"
                  className={styles.img}
                />
              </figure>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
