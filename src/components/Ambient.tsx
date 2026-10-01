"use client";

import { useEffect, useRef } from "react";
import styles from "./Ambient.module.css";

export function Ambient() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      root.style.setProperty("--ax", cx.toFixed(4));
      root.style.setProperty("--ay", cy.toFixed(4));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className={`ambient ${styles.root}`} aria-hidden="true">
      <div className={`ambient__aurora ${styles.aurora}`}>
        <div className="ambient__auroraInner" />
      </div>
      <div className={styles.parallaxA}>
        <div className="ambient__blob ambient__blob--a" />
      </div>
      <div className={styles.parallaxB}>
        <div className="ambient__blob ambient__blob--b" />
      </div>
      <div className={styles.parallaxC}>
        <div className="ambient__blob ambient__blob--c" />
      </div>
      <div className="ambient__vignette" />
      <div className="ambient__grain" />
    </div>
  );
}
