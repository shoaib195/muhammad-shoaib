"use client";

import { useEffect, useState } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { Loader } from "@/components/Loader";
import { Ambient } from "@/components/Ambient";
import { ThemeClass } from "@/components/ThemeClass";

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reducedMotion) setReady(true);
  }, [reducedMotion]);

  return (
    <>
      <ThemeClass name="theme-veronica" />
      {!reducedMotion && !ready && (
        <Loader onComplete={() => setReady(true)} />
      )}
      {(ready || reducedMotion) && (
        <>
          <Ambient />
          <SmoothScroll />
          <CustomCursor />
          {children}
        </>
      )}
    </>
  );
}
