"use client";

import { useLanding } from "../cms/CmsProvider";
import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";
import s from "../Site.module.css";

export function Contact() {
  const landing = useLanding();
  const { contact, site, socials } = landing;
  const linkedin = socials.find((x) => x.label === "LinkedIn")?.href ?? "#";
  const aside = contact.aside;

  return (
    <section className={s.section} id="contact">
      <div className={s.sectionGlow} aria-hidden="true" />
      <div className={`${s.container} ${styles.inner}`}>
        <Reveal className={styles.head}>
          <div className={s.taglineRow}>
            <p className={s.tagline}>{contact.tagline}</p>
            <span className={s.taglineLine} aria-hidden="true" />
          </div>
          <h2 className={`${s.h2} ${styles.h2}`}>
            <span className={s.dim}>{contact.dim}</span>
            <span className={s.bright}>
              {contact.bright} <span className={s.textGradient}>{contact.brightAccent}</span>
            </span>
          </h2>
          <p className={`${s.bodyMuted} ${styles.lead}`}>{contact.lead}</p>
        </Reveal>

        <div className={styles.grid}>
          <Reveal delay={0.05} className={`${s.card} ${styles.formCard}`}>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className={styles.aside}>
            <div className={styles.availability}>
              <span className={`${s.badge} ${s.badgeAccent}`}>
                <span className={s.badgeDot} />
                {aside.heading}
              </span>
              <ul className={styles.tags}>
                {aside.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <dl className={styles.facts}>
              <div>
                <dt>Location</dt>
                <dd>{aside.location}</dd>
              </div>
              <div>
                <dt>Response</dt>
                <dd>{aside.reply}</dd>
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
