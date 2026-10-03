import type { ReactNode } from "react";
import { siteFontClass } from "@/site/fonts";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={siteFontClass}
      style={{
        minHeight: "100svh",
        background: "#f4f5f7",
        color: "#121417",
        isolation: "isolate",
      }}
    >
      {children}
    </div>
  );
}
