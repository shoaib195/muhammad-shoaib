import type { Metadata } from "next";
import { Site } from "@/site/Site";
import { siteFontClass } from "@/site/fonts";

export const metadata: Metadata = {
  title: "Muhammad Shoaib — Frontend Engineer",
  description:
    "Frontend engineer with 7+ years experience in React, Next.js, React Native, and AI automations. Based in Karachi, Pakistan.",
  icons: {
    icon: [{ url: "/v2/fav-icon.png", type: "image/png" }],
    apple: [{ url: "/v2/fav-icon.png", type: "image/png" }],
  },
};

export default function HomePage() {
  return (
    <div className={siteFontClass}>
      <Site />
    </div>
  );
}
