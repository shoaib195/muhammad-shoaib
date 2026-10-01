"use client";

import { useEffect } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { About } from "./components/About";
import { CTA } from "./components/CTA";
import { Education } from "./components/Education";
import { Ethos } from "./components/Ethos";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { LogoMarquee } from "./components/LogoMarquee";
import { Nav } from "./components/Nav";
import { Process } from "./components/Process";
import { SelectedWorks } from "./components/SelectedWorks";
import { Skills } from "./components/Skills";
import { WorksCollage } from "./components/WorksCollage";
import styles from "./ElianSite.module.css";

export function ElianSite() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlBg = html.style.background;
    const prevBodyBg = body.style.background;
    const prevBodyColor = body.style.color;
    html.style.background = "#ffffff";
    body.style.background = "#ffffff";
    body.style.color = "#0a0a0a";
    return () => {
      html.style.background = prevHtmlBg;
      body.style.background = prevBodyBg;
      body.style.color = prevBodyColor;
    };
  }, []);

  return (
    <div className={styles.root}>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <LogoMarquee />
        <WorksCollage />
        <Skills />
        <Ethos />
        <Process />
        <SelectedWorks />
        <About />
        <Education />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
