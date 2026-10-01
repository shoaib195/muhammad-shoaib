"use client";

import { brands } from "../data";
import styles from "./LogoMarquee.module.css";

export function LogoMarquee() {
  const row = [...brands, ...brands];

  return (
    <section className={styles.section} aria-label="Brands worked with">
      <div className={styles.trackWrap}>
        <div className={styles.track}>
          {row.map((brand, i) => (
            <span key={`${brand}-${i}`} className={styles.item}>
              {brand}
            </span>
          ))}
        </div>
        <div className={styles.track} aria-hidden="true">
          {row.map((brand, i) => (
            <span key={`dup-${brand}-${i}`} className={styles.item}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
