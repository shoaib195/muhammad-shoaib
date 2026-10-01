"use client";

import { motion, useReducedMotion } from "framer-motion";
import { stackGroups, stats } from "../content";
import { Reveal } from "./Reveal";
import styles from "./Stats.module.css";
import s from "../Site.module.css";

export function Stats() {
  const reduced = useReducedMotion();

  return (
    <section className={styles.section} id="stats" aria-label="Credibility and stack">
      <div className={`${s.container} ${styles.inner}`}>
        <Reveal>
          <ul className={styles.strip}>
            {stats.map((st, i) => (
              <motion.li
                key={st.label}
                className={styles.stat}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.06 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={styles.value}>{st.value}</span>
                <span className={styles.label}>{st.label}</span>
                <span className={styles.note}>{st.note}</span>
              </motion.li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className={styles.stackRow}>
          <p className={styles.stackLabel}>
            <span className={styles.stackLine} aria-hidden="true" />
            Stack I ship with
            <span className={styles.stackLine} aria-hidden="true" />
          </p>
          <ul className={styles.groups}>
            {stackGroups.map((g) => (
              <li key={g.title} className={styles.group}>
                <span className={styles.groupTitle}>{g.title}</span>
                <span className={styles.groupItems}>{g.items.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
