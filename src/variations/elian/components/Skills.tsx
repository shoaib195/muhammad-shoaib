"use client";

import Image from "next/image";
import { useState } from "react";
import { skillGroups } from "../data";
import { Reveal } from "./Reveal";
import styles from "./Skills.module.css";

function SkillIcon({ slug, color, name }: { slug: string; color: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className={styles.fallback}>{name.slice(0, 1)}</span>;
  }
  return (
    <Image
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt=""
      width={28}
      height={28}
      unoptimized
      className={styles.icon}
      onError={() => setFailed(true)}
    />
  );
}

export function Skills() {
  return (
    <section className={styles.section} id="skills" aria-labelledby="skills-title">
      <div className={styles.glow} aria-hidden="true" />
      <Reveal>
        <p className={styles.kicker}>/ Toolkit</p>
        <h2 id="skills-title" className={styles.title}>
          Skills & <em>technologies</em>
        </h2>
        <p className={styles.sub}>
          Frontend, mobile, AI automations, CMS, and performance — the stack I
          use to ship reliable products.
        </p>
      </Reveal>

      <div className={styles.groups}>
        {skillGroups.map((group, gi) => (
          <Reveal key={group.title} delay={gi * 0.06} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.grid}>
              {group.skills.map((skill) => (
                <li key={`${group.title}-${skill.name}`} className={styles.card}>
                  <span className={styles.iconWrap}>
                    <SkillIcon
                      slug={skill.slug}
                      color={skill.color}
                      name={skill.name}
                    />
                  </span>
                  <span className={styles.name}>{skill.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
