import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { ElianSite } from "@/variations/elian/ElianSite";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-elian-serif",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-elian-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Muhammad Shoaib — Product Designer",
  description:
    "Product designer crafting digital experiences with strategy, craft, and empathy.",
};

export default function Variation2Page() {
  return (
    <div className={`${cormorant.variable} ${jakarta.variable}`}>
      <ElianSite />
    </div>
  );
}
