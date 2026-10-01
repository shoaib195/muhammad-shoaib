"use client";

import Image from "next/image";
import { blogs } from "./data";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import styles from "./Blog.module.css";

export function Blog() {
  return (
    <section id="craft" className={styles.craft} aria-labelledby="craft-title">
      <div className={styles.inner}>
        <Reveal className={styles.header}>
          <p className={styles.eyebrow}>LATEST ARTICLES</p>
          <h2 id="craft-title" className={styles.title}>
            BEHIND THE CRAFT
          </h2>
        </Reveal>

        <RevealGroup className={styles.grid}>
          {blogs.map((post) => (
            <RevealItem key={post.id}>
              <a href="#craft" className={styles.card}>
                <div className={styles.media}>
                  <span className={styles.badge}>{post.category}</span>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  />
                </div>
                <p className={styles.date}>{post.date}</p>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
