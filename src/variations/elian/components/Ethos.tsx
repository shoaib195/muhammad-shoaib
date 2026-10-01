"use client";

import { motion, useReducedMotion } from "framer-motion";
import { capabilities, site } from "../data";
import { Reveal } from "./Reveal";
import styles from "./Ethos.module.css";

const positions = [
  { top: "6%", left: "8%", rotate: -8 },
  { top: "10%", right: "10%", rotate: 7 },
  { top: "48%", left: "4%", rotate: 5 },
  { top: "52%", right: "6%", rotate: -6 },
  { bottom: "8%", left: "18%", rotate: -4 },
  { bottom: "12%", right: "14%", rotate: 8 },
];

export function Ethos() {
  const reduced = useReducedMotion();

  return (
    <section className={styles.section} aria-labelledby="elian-ethos">
      <p className={styles.kicker}>/ Who I am</p>
      <div className={styles.stage}>
        {capabilities.map((item, i) => {
          const pos = positions[i % positions.length];
          return (
            <motion.span
              key={item.label}
              className={styles.pill}
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
                ["--pill" as string]: item.color,
              }}
              initial={{ rotate: pos.rotate }}
              animate={
                reduced
                  ? { rotate: pos.rotate }
                  : { y: [0, i % 2 === 0 ? -12 : 12, 0], rotate: pos.rotate }
              }
              transition={{
                duration: 4.2 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            >
              <i style={{ background: item.color }} aria-hidden="true" />
              {item.label}
            </motion.span>
          );
        })}

        <Reveal className={styles.copy}>
          <h2 id="elian-ethos" className={styles.headline}>
            {site.ethosLead}{" "}
            <em>{site.ethosHighlight}</em> {site.ethosTail}
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
