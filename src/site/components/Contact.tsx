"use client";

import { contactAside } from "../content";
import { site, socials } from "../data";
import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";
import s from "../Site.module.css";

export function Contact() {
  const linkedin = socials.find((x) => x.label === "LinkedIn")?.href ?? "#";

  return (
    <section className={s.section} id="contact">
      <div className={s.sectionGlow} aria-hidden="true" />
      <div className={`${s.container} ${styles.inner}`}>
        <Reveal className={styles.head}>
          <div className={s.taglineRow}>
            <p className={s.tagline}>08 / Contact</p>
            <span className={s.taglineLine} aria-hidden="true" />
          </div>
          <h2 className={`${s.h2} ${styles.h2}`}>
            <span className={s.dim}>Have a product</span>
            <span className={s.bright}>
              worth <span className={s.textGradient}>building?</span>
            </span>
          </h2>
          <p className={`${s.bodyMuted} ${styles.lead}`}>
            Let&apos;s talk about what you&apos;re building, what isn&apos;t working, and where I can help.
          </p>
        </Reveal>

        <div className={styles.grid}>
          <Reveal delay={0.05} className={`${s.card} ${styles.formCard}`}>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className={styles.aside}>
            <div className={styles.availability}>
              <span className={`${s.badge} ${s.badgeAccent}`}>
                <span className={s.badgeDot} />
                {contactAside.heading}
              </span>
              <ul className={styles.tags}>
                {contactAside.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <dl className={styles.facts}>
              <div>
                <dt>Location</dt>
                <dd>{contactAside.location}</dd>
              </div>
              <div>
                <dt>Response</dt>
                <dd>{contactAside.reply}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </dd>
              </div>
              <div>
                <dt>LinkedIn</dt>
                <dd>
                  <a href={linkedin} target="_blank" rel="noreferrer">
                    Connect on LinkedIn ↗
                  </a>
                </dd>
              </div>
            </dl>

            <p className={styles.note}>
              <span className={s.hand}>prefer a quick call? mention it in the message and I&apos;ll send a link.</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
