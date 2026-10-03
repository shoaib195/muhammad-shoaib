"use client";

import Image from "next/image";
import { useLanding } from "../cms/CmsProvider";
import { SmartLink } from "./SmartLink";
import styles from "./Footer.module.css";

export function Footer() {
  const landing = useLanding();
  const { site, socials } = landing;
  const footerLinks = landing.footer.links;
  const year = new Date().getFullYear();
  const linkedin = socials.find((x) => x.label === "LinkedIn")?.href ?? "#";
  const whatsapp = `https://wa.me/${site.phone.replace(/[^\d]/g, "")}`;

  return (
    <footer className={styles.footer}>
      <div className={styles.frame} aria-hidden="true">
        <div className={styles.frameFade} />
        <div className={styles.framePattern} />
      </div>

      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.left}>
            <SmartLink href="/" className={styles.brand} aria-label={`${site.name} home`}>
              <Image
                src="/v2/main-logo.png"
                alt={site.name}
                width={200}
                height={36}
                className={styles.logoImg}
              />
            </SmartLink>
            <span className={styles.slash}>/</span>
            <a href={`mailto:${site.email}`} className={styles.email}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>{site.email}</span>
            </a>
          </div>

          <div className={styles.right}>
            <p className={styles.follow}>~ Follow me ~</p>
            <div className={styles.socials}>
              <a aria-label="LinkedIn" href={linkedin} target="_blank" rel="noreferrer" className={styles.socialBtn}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                </svg>
              </a>
              <a aria-label="WhatsApp" href={whatsapp} target="_blank" rel="noreferrer" className={styles.socialBtn}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
              <a aria-label="Email" href={`mailto:${site.email}`} className={styles.socialBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
              <a aria-label="Resume" href={site.resumeUrl} download={site.resumeFileName} className={styles.socialBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10 9H8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            ©{year} {site.name} - All rights reserved.
          </p>
          <div className={styles.links}>
            {footerLinks.map((l) => (
              <SmartLink key={l.href} href={l.href}>
                {l.label}
              </SmartLink>
            ))}
            <a href={site.resumeUrl} download={site.resumeFileName}>
              Resume (PDF)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
