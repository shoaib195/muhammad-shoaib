import type { Metadata } from "next";
import { Anton, Manrope } from "next/font/google";
import { PortiaSite } from "@/variations/portia/PortiaSite";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-portia-body",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Portia Willson — Portix Portfolio",
  description:
    "UI & UX designer. Design that converts visitors into buyers. Featured works, process, and contact.",
};

export default function Variation1Page() {
  return (
    <div className={`${anton.variable} ${manrope.variable}`}>
      <PortiaSite />
    </div>
  );
}
