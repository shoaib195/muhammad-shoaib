"use client";

import { achievements, education, hobbies } from "../data";
import { Reveal } from "./Reveal";
import styles from "./Education.module.css";

export function Education() {
  return (
    <section
      className={styles.section}
      id="education"
      aria-labelledby="education-title"
    >
      <div className={styles.inner}>
        <Reveal className={styles.col}>
          <p className={styles.kicker}>/ Education</p>
          <h2 id="education-title" className={styles.title}>
            Learning & <em>credentials</em>
          </h2>
          <ul className={styles.list}>
            {education.map((item) => (
              <li key={item.title} className={styles.item}>
                <div>
                  <p className={styles.itemTitle}>{item.title}</p>
                  <p className={styles.itemPlace}>{item.place}</p>
                </div>
                {item.years ? (
                  <span className={styles.years}>{item.years}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.col} delay={0.08}>
          <p className={styles.kicker}>/ Achievements</p>
          <h2 className={styles.title}>
            Highlights & <em>wins</em>
          </h2>
          <ul className={styles.achievements}>
            {achievements.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
          <div className={styles.hobbies}>
            <p className={styles.hobbiesLabel}>Hobbies</p>
            <div className={styles.hobbyRow}>
              {hobbies.map((h) => (
                <span key={h} className={styles.hobby}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
