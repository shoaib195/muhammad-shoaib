"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanding } from "../cms/CmsProvider";
import styles from "./ContactForm.module.css";
import s from "../Site.module.css";

type Status = "idle" | "sending" | "sent" | "error";

type Fields = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  details: string;
  website: string; // honeypot
};

const empty: Fields = { name: "", email: "", company: "", projectType: "", details: "", website: "" };

export function ContactForm() {
  const landing = useLanding();
  const projectTypes = landing.contact.projectTypes;
  const site = landing.site;
  const [f, setF] = useState<Fields>(empty);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  const mailto = () => {
    const subject = encodeURIComponent(`Inquiry from ${f.name}${f.projectType ? ` — ${f.projectType}` : ""}`);
    const body = encodeURIComponent(
      [`Name: ${f.name}`, `Email: ${f.email}`, f.company && `Company / website: ${f.company}`, f.projectType && `Project type: ${f.projectType}`, "", f.details]
        .filter(Boolean)
        .join("\n"),
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    setFallback(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fallback?: boolean };
      if (res.ok && data.ok) {
        setStatus("sent");
        return;
      }
      setFallback(Boolean(data.fallback));
      setError(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setFallback(true);
      setError("Network error. You can send the same message by email instead.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        className={styles.sent}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        role="status"
      >
        <span className={styles.sentIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </span>
        <h3>Inquiry sent.</h3>
        <p>Thanks {f.name.split(" ")[0] || ""} — I read every message personally and reply within 24 hours.</p>
        <button type="button" className={`${s.btn} ${s.btnSecondary}`} onClick={() => { setF(empty); setStatus("idle"); }}>
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row2}>
        <label className={styles.field}>
          <span>Name</span>
          <input name="name" autoComplete="name" required value={f.name} onChange={set("name")} placeholder="Your name" />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required value={f.email} onChange={set("email")} placeholder="you@company.com" />
        </label>
      </div>

      <div className={styles.row2}>
        <label className={styles.field}>
          <span>
            Company / website <em>optional</em>
          </span>
          <input name="company" autoComplete="organization" value={f.company} onChange={set("company")} placeholder="Acme · acme.com" />
        </label>
        <label className={styles.field}>
          <span>Project type</span>
          <span className={styles.selectWrap}>
            <select name="projectType" value={f.projectType} onChange={set("projectType")}>
              <option value="">Select one…</option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </label>
      </div>

      <label className={styles.field}>
        <span>Project details</span>
        <textarea
          name="details"
          required
          rows={5}
          value={f.details}
          onChange={set("details")}
          placeholder="What are you building, what isn't working, and where do you need help? Timelines and links welcome."
        />
      </label>

      {/* Honeypot — hidden from humans */}
      <label className={styles.hp} aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" name="website" value={f.website} onChange={set("website")} />
      </label>

      <div className={styles.actions}>
        <button type="submit" className={`${s.btn} ${s.btnPrimary} ${styles.submit}`} disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send inquiry
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
        <p className={styles.privacy}>No newsletters, no sharing. Your message goes straight to my inbox.</p>
      </div>

      <AnimatePresence>
        {status === "error" && error && (
          <motion.div
            className={styles.error}
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span>{error}</span>
            {fallback && (
              <a href={mailto()} className={styles.errorLink}>
                Send via email instead ↗
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
