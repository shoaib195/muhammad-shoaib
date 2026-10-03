"use client";

import { useEffect, type ReactNode } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Gap } from "./components/Gap";
import { Bring } from "./components/Bring";
import { Stakes } from "./components/Stakes";
import { Showcase } from "./components/Showcase";
import { Experience } from "./components/Experience";
import { Process } from "./components/Process";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { ThemeProvider, useTheme } from "./theme";
import { CmsProvider } from "./cms/CmsProvider";
import type { LandingContent, ExperienceItem } from "./cms/types";
import type { Project } from "./projects";
import styles from "./Site.module.css";

const BG = { dark: "#08090b", light: "#fbfaf9" } as const;
const INK = { dark: "#fafafa", light: "#101012" } as const;

function Shell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.background;
    const prevBody = body.style.background;
    const prevColor = body.style.color;
    const prevScheme = html.style.colorScheme;
    html.style.background = BG[theme];
    html.style.colorScheme = theme;
    body.style.background = BG[theme];
    body.style.color = INK[theme];
    return () => {
      html.style.background = prevHtml;
      html.style.colorScheme = prevScheme;
      body.style.background = prevBody;
      body.style.color = prevColor;
    };
  }, [theme]);

  return (
    <div className={styles.site} data-theme={theme}>
      <div className={styles.ambient} aria-hidden="true">
        <div className={styles.noise} />
      </div>
      <SmoothScroll />
      <Header />
      {children}
      <Footer />
      <div id="ms-modal-root" />
    </div>
  );
}

export function SiteShell({
  children,
  landing,
  projects = [],
  experiences = [],
}: {
  children: ReactNode;
  landing: LandingContent;
  projects?: Project[];
  experiences?: ExperienceItem[];
}) {
  return (
    <ThemeProvider>
      <CmsProvider landing={landing} projects={projects} experiences={experiences}>
        <Shell>{children}</Shell>
      </CmsProvider>
    </ThemeProvider>
  );
}

export function Site({
  landing,
  projects,
  experiences,
}: {
  landing: LandingContent;
  projects: Project[];
  experiences: ExperienceItem[];
}) {
  return (
    <SiteShell landing={landing} projects={projects} experiences={experiences}>
      <main className={styles.main}>
        <Hero />
        <Stats />
        <Gap />
        <Bring />
        <Stakes />
        <Showcase />
        <Experience />
        <Process />
        <About />
        <Contact />
      </main>
      <CTA />
    </SiteShell>
  );
}
