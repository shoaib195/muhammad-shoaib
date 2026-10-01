"use client";

import { useEffect } from "react";

export function ThemeClass({ name }: { name: string }) {
  useEffect(() => {
    document.documentElement.classList.add(name);
    document.body.classList.add(name);
    return () => {
      document.documentElement.classList.remove(name);
      document.body.classList.remove(name);
    };
  }, [name]);

  return null;
}
