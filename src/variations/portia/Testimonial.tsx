"use client";

import Image from "next/image";
import { testimonial } from "./data";
import { Reveal } from "./Reveal";
import styles from "./Testimonial.module.css";

export function Testimonial() {
  return (
    <section
      id="testimonial"
      className={styles.testimonial}
      aria-labelledby="testimonial-title"
    >
      <div className={styles.inner}>
        <Reveal>
          <figure className={styles.card}>
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.avatar}>
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                fill
                sizes="120px"
              />
            </div>
            <div className={styles.content}>
              <p className={styles.quoteMark} aria-hidden="true">
                “
              </p>
              <blockquote>
                <p id="testimonial-title" className={styles.quote}>
                  {testimonial.quote}
                </p>
              </blockquote>
              <figcaption className={styles.person}>
                <p className={styles.name}>{testimonial.name}</p>
                <p className={styles.role}>{testimonial.role}</p>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
