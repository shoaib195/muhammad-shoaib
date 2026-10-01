"use client";

import Image from "next/image";
import { useState } from "react";
import { experience, site, socials } from "../data";
import { Reveal } from "./Reveal";
import styles from "./About.module.css";

export function About() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={styles.section} id="about" aria-labelledby="elian-about">
      <div className={styles.layout}>
        <Reveal className={styles.left}>
          <div className={styles.frame}>
            <Image
              src="/v2/about.jpg"
              alt="Muhammad Shoaib"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className={styles.photo}
            />
          </div>
          <div className={styles.personMeta}>
            <p className={styles.personName}>{site.name}</p>
            <p className={styles.personRole}>{site.roleTitle}</p>
            <p className={styles.contactLine}>{site.location}</p>
            <p className={styles.contactLine}>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
            </p>
            <ul className={styles.socials} aria-label="Social links">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={styles.social}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={site.resumeUrl}
              download={site.resumeFileName}
              className={styles.resumeBtn}
            >
              Download Resume
            </a>
          </div>
        </Reveal>

        <Reveal className={styles.right} delay={0.08}>
          <p className={styles.kicker}>/ Experience</p>
          <h2 id="elian-about" className={styles.title}>
            Building products <em>since 2018</em>
          </h2>
          <p className={styles.bio}>{site.aboutBio}</p>

          <ul className={styles.exp}>
            {experience.map((item, index) => {
              const isOpen = open === index;
              return (
                <li key={`${item.company}-${item.years}`} className={styles.expItem}>
                  <button
                    type="button"
                    className={styles.expTrigger}
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <div>
                      <p className={styles.role}>{item.role}</p>
                      <p className={styles.company}>{item.company}</p>
                    </div>
                    <span className={styles.years}>{item.years}</span>
                  </button>
                  {isOpen && item.highlights?.length ? (
                    <ul className={styles.highlights}>
                      {item.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
