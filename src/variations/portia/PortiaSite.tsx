"use client";

import { useEffect } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Works } from "./Works";
import { Showreel } from "./Showreel";
import { Process } from "./Process";
import { Recognition } from "./Recognition";
import { Testimonial } from "./Testimonial";
import { CTA } from "./CTA";
import { Blog } from "./Blog";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";
import styles from "./PortiaSite.module.css";

export function PortiaSite() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.background;
    const prevBody = body.style.background;
    const prevColor = body.style.color;
    html.style.background = "#121212";
    body.style.background = "#121212";
    body.style.color = "#ffffff";
    return () => {
      html.style.background = prevHtml;
      body.style.background = prevBody;
      body.style.color = prevColor;
    };
  }, []);

  return (
    <div className={styles.site}>
      <SmoothScroll />
      <Nav />
      <main className={styles.main}>
        <Hero />
        <Works />
        <Showreel />
        <Process />
        <Recognition />
        <Testimonial />
        <CTA />
        <Blog />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
