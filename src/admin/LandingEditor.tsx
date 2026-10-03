"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { defaultLanding, LANDING_SETTING_KEY } from "@/site/cms/defaults";
import type { LandingContent } from "@/site/cms/types";
import { mergeLanding } from "@/site/cms/load-client";
import { AdminButton } from "./AdminButton";
import { ImageUpload, MultiImageUpload } from "./ImageUpload";
import { SkeletonCard } from "./Skeleton";
import styles from "./admin.module.css";

const sections = [
  { id: "site", label: "Identity" },
  { id: "nav", label: "Nav / Footer" },
  { id: "hero", label: "Hero" },
  { id: "stats", label: "Stats" },
  { id: "gap", label: "Gap" },
  { id: "bring", label: "Bring" },
  { id: "stakes", label: "Stakes" },
  { id: "showcase", label: "Showcase" },
  { id: "experience", label: "Experience copy" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "cta", label: "Final CTA" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className={styles.label}>
      {label}
      {multiline ? (
        <textarea className={styles.textarea} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={styles.input} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function LinesField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  return (
    <label className={styles.label}>
      {label}
      {hint ? <span className={styles.muted}>{hint}</span> : null}
      <textarea
        className={styles.textarea}
        value={value.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((x) => x.trimEnd())
              .filter((x, i, arr) => !(x === "" && i === arr.length - 1)),
          )
        }
      />
    </label>
  );
}

export function LandingEditor({ email }: { email: string }) {
  const [landing, setLanding] = useState<LandingContent>(structuredClone(defaultLanding));
  const [section, setSection] = useState<SectionId>("hero");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings?.landing) setLanding(mergeLanding(data.settings.landing));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const patch = useMemo(
    () =>
      <K extends keyof LandingContent>(key: K, value: LandingContent[K]) => {
        setLanding((prev) => ({ ...prev, [key]: value }));
      },
    [],
  );

  async function save(e?: FormEvent) {
    e?.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: LANDING_SETTING_KEY, value: landing }),
      });
      if (!res.ok) {
        setMsg("Save failed — check login / database.");
        return;
      }
      setMsg("Saved. Live site refreshed.");
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return (
      <div className={styles.grid}>
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
      </div>
    );
  }

  return (
    <form className={`${styles.form} ${styles.formWide}`} onSubmit={save}>
      <div className={styles.panelHead}>
        <p className={styles.muted}>Signed in as {email}. Changes save to Neon and update the homepage.</p>
        <div className={styles.row}>
          <AdminButton
            onClick={() => {
              setLanding(structuredClone(defaultLanding));
              setMsg("Reset to current code defaults (not saved yet).");
            }}
          >
            Reset to defaults
          </AdminButton>
          <AdminButton type="submit" variant="primary" loading={saving}>
            Save landing
          </AdminButton>
        </div>
      </div>

      {msg ? <p className={styles.toast}>{msg}</p> : null}

      <div className={styles.sectionTabs}>
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`${styles.sectionTab} ${section === s.id ? styles.sectionTabActive : ""}`}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={`${styles.card} ${styles.panel}`}>
        {section === "site" ? (
          <div className={styles.fieldGrid}>
            {(
              [
                ["name", "Full name"],
                ["firstName", "First name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["location", "Location"],
                ["roleTitle", "Role title"],
                ["resumeUrl", "Resume URL"],
                ["resumeFileName", "Resume filename"],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={landing.site[key]}
                onChange={(v) => patch("site", { ...landing.site, [key]: v })}
              />
            ))}
          </div>
        ) : null}

        {section === "nav" ? (
          <>
            <LinesField
              label="Nav links (Label | href)"
              hint="One per line"
              value={landing.nav.links.map((l) => `${l.label} | ${l.href}`)}
              onChange={(lines) =>
                patch("nav", {
                  ...landing.nav,
                  links: lines
                    .map((line) => {
                      const [label, href] = line.split("|").map((x) => x.trim());
                      return label && href ? { label, href } : null;
                    })
                    .filter(Boolean) as { label: string; href: string }[],
                })
              }
            />
            <div className={styles.fieldGrid}>
              <Field
                label="Nav CTA label"
                value={landing.nav.cta.label}
                onChange={(v) => patch("nav", { ...landing.nav, cta: { ...landing.nav.cta, label: v } })}
              />
              <Field
                label="Nav CTA href"
                value={landing.nav.cta.href}
                onChange={(v) => patch("nav", { ...landing.nav, cta: { ...landing.nav.cta, href: v } })}
              />
            </div>
            <LinesField
              label="Footer links (Label | href)"
              value={landing.footer.links.map((l) => `${l.label} | ${l.href}`)}
              onChange={(lines) =>
                patch("footer", {
                  links: lines
                    .map((line) => {
                      const [label, href] = line.split("|").map((x) => x.trim());
                      return label && href ? { label, href } : null;
                    })
                    .filter(Boolean) as { label: string; href: string }[],
                })
              }
            />
            <LinesField
              label="Socials (Label | href)"
              value={landing.socials.map((l) => `${l.label} | ${l.href}`)}
              onChange={(lines) =>
                patch(
                  "socials",
                  lines
                    .map((line) => {
                      const [label, href] = line.split("|").map((x) => x.trim());
                      return label && href ? { label, href } : null;
                    })
                    .filter(Boolean) as { label: string; href: string }[],
                )
              }
            />
          </>
        ) : null}

        {section === "hero" ? (
          <>
            <ImageUpload
              label="Hero portrait"
              value={landing.hero.portraitSrc}
              folder="landing"
              onChange={(portraitSrc) => patch("hero", { ...landing.hero, portraitSrc })}
            />
            <MultiImageUpload
              label="Hero avatars"
              values={landing.hero.avatars}
              folder="landing"
              hint="Small avatar stack in the hero proof pill"
              onChange={(avatars) => patch("hero", { ...landing.hero, avatars })}
            />
            <div className={styles.fieldGrid}>
              <Field label="Title line 1" value={landing.hero.titleLine1} onChange={(v) => patch("hero", { ...landing.hero, titleLine1: v })} />
              <Field label="Title accent" value={landing.hero.titleAccent} onChange={(v) => patch("hero", { ...landing.hero, titleAccent: v })} />
              <Field label="Proof text" value={landing.hero.proofText} onChange={(v) => patch("hero", { ...landing.hero, proofText: v })} />
              <Field label="Badge" value={landing.hero.badgeText} onChange={(v) => patch("hero", { ...landing.hero, badgeText: v })} />
              <Field label="Rating" value={landing.hero.rating} onChange={(v) => patch("hero", { ...landing.hero, rating: v })} />
            </div>
            <Field label="Lead" value={landing.hero.lead} onChange={(v) => patch("hero", { ...landing.hero, lead: v })} multiline />
            <LinesField label="Handwriting lines" value={landing.hero.handLines} onChange={(v) => patch("hero", { ...landing.hero, handLines: v })} />
            <LinesField label="Features" value={landing.hero.features} onChange={(v) => patch("hero", { ...landing.hero, features: v })} />
            <LinesField label="Trust items" value={landing.hero.trustItems} onChange={(v) => patch("hero", { ...landing.hero, trustItems: v })} />
            <div className={styles.fieldGrid}>
              <Field label="Primary CTA label" value={landing.hero.primaryCta.label} onChange={(v) => patch("hero", { ...landing.hero, primaryCta: { ...landing.hero.primaryCta, label: v } })} />
              <Field label="Primary CTA href" value={landing.hero.primaryCta.href} onChange={(v) => patch("hero", { ...landing.hero, primaryCta: { ...landing.hero.primaryCta, href: v } })} />
              <Field label="Secondary CTA label" value={landing.hero.secondaryCta.label} onChange={(v) => patch("hero", { ...landing.hero, secondaryCta: { ...landing.hero.secondaryCta, label: v } })} />
              <Field label="Secondary CTA href" value={landing.hero.secondaryCta.href} onChange={(v) => patch("hero", { ...landing.hero, secondaryCta: { ...landing.hero.secondaryCta, href: v } })} />
            </div>
          </>
        ) : null}

        {section === "stats" ? (
          <>
            {landing.stats.map((stat, i) => (
              <div key={i} className={styles.itemCard}>
                <p className={styles.itemCardTitle}>Stat {i + 1}</p>
                <div className={styles.fieldGrid}>
                  <Field label="Value" value={stat.value} onChange={(v) => {
                    const stats = [...landing.stats];
                    stats[i] = { ...stat, value: v };
                    patch("stats", stats);
                  }} />
                  <Field label="Label" value={stat.label} onChange={(v) => {
                    const stats = [...landing.stats];
                    stats[i] = { ...stat, label: v };
                    patch("stats", stats);
                  }} />
                  <Field label="Note" value={stat.note} onChange={(v) => {
                    const stats = [...landing.stats];
                    stats[i] = { ...stat, note: v };
                    patch("stats", stats);
                  }} />
                </div>
              </div>
            ))}
            {landing.stackGroups.map((g, i) => (
              <div key={g.title + i} className={styles.itemCard}>
                <Field label="Stack group title" value={g.title} onChange={(v) => {
                  const stackGroups = [...landing.stackGroups];
                  stackGroups[i] = { ...g, title: v };
                  patch("stackGroups", stackGroups);
                }} />
                <LinesField label="Items" value={g.items} onChange={(v) => {
                  const stackGroups = [...landing.stackGroups];
                  stackGroups[i] = { ...g, items: v };
                  patch("stackGroups", stackGroups);
                }} />
              </div>
            ))}
          </>
        ) : null}

        {section === "gap" ? (
          <div className={styles.fieldGrid}>
            {(
              [
                ["tagline", "Tagline"],
                ["dim", "Dim heading"],
                ["bright", "Bright heading"],
                ["brightAccent", "Accent word"],
                ["body", "Body"],
                ["bodyMutedBefore", "Muted before"],
                ["bodyMutedUnderline", "Underlined phrase"],
                ["bodyMutedAfter", "Muted after"],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={landing.gap[key]}
                multiline={key.startsWith("body")}
                onChange={(v) => patch("gap", { ...landing.gap, [key]: v })}
              />
            ))}
            <LinesField label="Hand lines" value={landing.gap.handLines} onChange={(v) => patch("gap", { ...landing.gap, handLines: v })} />
            <LinesField
              label="Items (Label | stack)"
              value={landing.gap.items.map((x) => `${x.label} | ${x.stack}`)}
              onChange={(lines) =>
                patch("gap", {
                  ...landing.gap,
                  items: lines
                    .map((line) => {
                      const [label, stack] = line.split("|").map((x) => x.trim());
                      return label && stack ? { label, stack } : null;
                    })
                    .filter(Boolean) as { label: string; stack: string }[],
                })
              }
            />
          </div>
        ) : null}

        {section === "bring" ? (
          <>
            <div className={styles.fieldGrid}>
              <Field label="Tagline" value={landing.bring.tagline} onChange={(v) => patch("bring", { ...landing.bring, tagline: v })} />
              <Field label="Dim" value={landing.bring.dim} onChange={(v) => patch("bring", { ...landing.bring, dim: v })} />
              <Field label="Bright" value={landing.bring.bright} onChange={(v) => patch("bring", { ...landing.bring, bright: v })} />
              <Field label="Accent" value={landing.bring.brightAccent} onChange={(v) => patch("bring", { ...landing.bring, brightAccent: v })} />
            </div>
            <Field label="Lead" value={landing.bring.lead} multiline onChange={(v) => patch("bring", { ...landing.bring, lead: v })} />
            {landing.bring.items.map((item, i) => (
              <div key={i} className={styles.itemCard}>
                <p className={styles.itemCardTitle}>Card {i + 1}</p>
                <Field label="Title" value={item.title} onChange={(v) => {
                  const items = [...landing.bring.items];
                  items[i] = { ...item, title: v };
                  patch("bring", { ...landing.bring, items });
                }} />
                <Field label="Body" value={item.body} multiline onChange={(v) => {
                  const items = [...landing.bring.items];
                  items[i] = { ...item, body: v };
                  patch("bring", { ...landing.bring, items });
                }} />
                <Field label="Detail" value={item.detail} onChange={(v) => {
                  const items = [...landing.bring.items];
                  items[i] = { ...item, detail: v };
                  patch("bring", { ...landing.bring, items });
                }} />
              </div>
            ))}
          </>
        ) : null}

        {section === "stakes" ? (
          <div className={styles.fieldGrid}>
            {(
              [
                ["tagline", "Tagline"],
                ["dim", "Dim"],
                ["bright", "Bright"],
                ["brightAccent", "Accent"],
                ["lead", "Lead"],
                ["leadSmall", "Lead small"],
                ["closingDim", "Closing dim"],
                ["closingBrightBefore", "Closing bright"],
                ["closingBrightAccent", "Closing accent"],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={landing.stakes[key]}
                multiline={key.includes("lead") || key.includes("closing")}
                onChange={(v) => patch("stakes", { ...landing.stakes, [key]: v })}
              />
            ))}
            <LinesField label="Break sequence" value={landing.stakes.sequence} onChange={(v) => patch("stakes", { ...landing.stakes, sequence: v })} />
          </div>
        ) : null}

        {section === "showcase" ? (
          <div className={styles.fieldGrid}>
            {(
              [
                ["tagline", "Tagline"],
                ["badge", "Badge"],
                ["titleAccent", "Accent number"],
                ["titleAfter", "Title after"],
                ["lead", "Lead"],
                ["leadNote", "Lead note"],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={landing.showcase[key]}
                multiline={key.startsWith("lead")}
                onChange={(v) => patch("showcase", { ...landing.showcase, [key]: v })}
              />
            ))}
          </div>
        ) : null}

        {section === "experience" ? (
          <div className={styles.fieldGrid}>
            {(
              [
                ["tagline", "Tagline"],
                ["dim", "Dim"],
                ["bright", "Bright"],
                ["brightAccent", "Accent"],
                ["aside", "Aside"],
                ["resumeLabel", "Resume button"],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={landing.experience[key]}
                multiline={key === "aside"}
                onChange={(v) => patch("experience", { ...landing.experience, [key]: v })}
              />
            ))}
          </div>
        ) : null}

        {section === "process" ? (
          <>
            <div className={styles.fieldGrid}>
              <Field label="Tagline" value={landing.process.tagline} onChange={(v) => patch("process", { ...landing.process, tagline: v })} />
              <Field label="Dim" value={landing.process.dim} onChange={(v) => patch("process", { ...landing.process, dim: v })} />
              <Field label="Bright" value={landing.process.bright} onChange={(v) => patch("process", { ...landing.process, bright: v })} />
              <Field label="Accent" value={landing.process.brightAccent} onChange={(v) => patch("process", { ...landing.process, brightAccent: v })} />
            </div>
            <Field label="Lead" value={landing.process.lead} multiline onChange={(v) => patch("process", { ...landing.process, lead: v })} />
            {landing.process.steps.map((step, i) => (
              <div key={step.step} className={styles.itemCard}>
                <p className={styles.itemCardTitle}>Step {step.step}</p>
                <div className={styles.fieldGrid}>
                  <Field label="Title" value={step.title} onChange={(v) => {
                    const steps = [...landing.process.steps];
                    steps[i] = { ...step, title: v };
                    patch("process", { ...landing.process, steps });
                  }} />
                  <Field label="Output" value={step.output} onChange={(v) => {
                    const steps = [...landing.process.steps];
                    steps[i] = { ...step, output: v };
                    patch("process", { ...landing.process, steps });
                  }} />
                </div>
                <Field label="Body" value={step.body} multiline onChange={(v) => {
                  const steps = [...landing.process.steps];
                  steps[i] = { ...step, body: v };
                  patch("process", { ...landing.process, steps });
                }} />
              </div>
            ))}
            <LinesField label="Includes" value={landing.process.includes} onChange={(v) => patch("process", { ...landing.process, includes: v })} />
          </>
        ) : null}

        {section === "about" ? (
          <>
            <ImageUpload
              label="About image"
              value={landing.about.imageSrc}
              folder="landing"
              onChange={(imageSrc) => patch("about", { ...landing.about, imageSrc })}
            />
            <div className={styles.fieldGrid}>
              <Field label="Tagline" value={landing.about.tagline} onChange={(v) => patch("about", { ...landing.about, tagline: v })} />
              <Field label="Heading" value={landing.about.heading} onChange={(v) => patch("about", { ...landing.about, heading: v })} />
              <Field label="Badge" value={landing.about.badge} onChange={(v) => patch("about", { ...landing.about, badge: v })} />
              <Field label="Caption" value={landing.about.caption} onChange={(v) => patch("about", { ...landing.about, caption: v })} />
            </div>
            <Field label="Statement" value={landing.about.statement} multiline onChange={(v) => patch("about", { ...landing.about, statement: v })} />
            <LinesField label="Paragraphs" value={landing.about.paragraphs} onChange={(v) => patch("about", { ...landing.about, paragraphs: v })} />
            <LinesField label="Prefer" value={landing.about.prefer} onChange={(v) => patch("about", { ...landing.about, prefer: v })} />
            <LinesField label="Stack" value={landing.about.stack} onChange={(v) => patch("about", { ...landing.about, stack: v })} />
            <Field label="Remote" value={landing.about.remote} multiline onChange={(v) => patch("about", { ...landing.about, remote: v })} />
          </>
        ) : null}

        {section === "contact" ? (
          <>
            <div className={styles.fieldGrid}>
              <Field label="Tagline" value={landing.contact.tagline} onChange={(v) => patch("contact", { ...landing.contact, tagline: v })} />
              <Field label="Dim" value={landing.contact.dim} onChange={(v) => patch("contact", { ...landing.contact, dim: v })} />
              <Field label="Bright" value={landing.contact.bright} onChange={(v) => patch("contact", { ...landing.contact, bright: v })} />
              <Field label="Accent" value={landing.contact.brightAccent} onChange={(v) => patch("contact", { ...landing.contact, brightAccent: v })} />
            </div>
            <Field label="Lead" value={landing.contact.lead} multiline onChange={(v) => patch("contact", { ...landing.contact, lead: v })} />
            <Field label="Aside heading" value={landing.contact.aside.heading} onChange={(v) => patch("contact", { ...landing.contact, aside: { ...landing.contact.aside, heading: v } })} />
            <LinesField label="Aside items" value={landing.contact.aside.items} onChange={(v) => patch("contact", { ...landing.contact, aside: { ...landing.contact.aside, items: v } })} />
            <div className={styles.fieldGrid}>
              <Field label="Location" value={landing.contact.aside.location} onChange={(v) => patch("contact", { ...landing.contact, aside: { ...landing.contact.aside, location: v } })} />
              <Field label="Reply" value={landing.contact.aside.reply} onChange={(v) => patch("contact", { ...landing.contact, aside: { ...landing.contact.aside, reply: v } })} />
            </div>
            <LinesField label="Project types" value={landing.contact.projectTypes} onChange={(v) => patch("contact", { ...landing.contact, projectTypes: v })} />
          </>
        ) : null}

        {section === "cta" ? (
          <>
            <MultiImageUpload
              label="CTA avatars"
              values={landing.cta.avatars}
              folder="landing"
              hint="Avatar row on the final CTA block"
              onChange={(avatars) => patch("cta", { ...landing.cta, avatars })}
            />
            <div className={styles.fieldGrid}>
              <Field label="Title line 1" value={landing.cta.titleLine1} onChange={(v) => patch("cta", { ...landing.cta, titleLine1: v })} />
              <Field label="Title accent" value={landing.cta.titleAccent} onChange={(v) => patch("cta", { ...landing.cta, titleAccent: v })} />
              <Field label="Lead" value={landing.cta.lead} multiline onChange={(v) => patch("cta", { ...landing.cta, lead: v })} />
              <Field label="Button label" value={landing.cta.buttonLabel} onChange={(v) => patch("cta", { ...landing.cta, buttonLabel: v })} />
              <Field label="Button href" value={landing.cta.buttonHref} onChange={(v) => patch("cta", { ...landing.cta, buttonHref: v })} />
              <Field label="Note" value={landing.cta.note} onChange={(v) => patch("cta", { ...landing.cta, note: v })} />
              <Field label="Social text" value={landing.cta.socialText} onChange={(v) => patch("cta", { ...landing.cta, socialText: v })} />
            </div>
          </>
        ) : null}
      </div>

      <div className={styles.row}>
        <AdminButton type="submit" variant="primary" loading={saving}>
          Save landing
        </AdminButton>
      </div>
    </form>
  );
}
