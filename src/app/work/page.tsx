import type { Metadata } from "next";
import { SiteShell } from "@/site/Site";
import { WorkPage } from "@/site/WorkPage";
import { siteFontClass } from "@/site/fonts";

export const metadata: Metadata = {
  title: "Work — Muhammad Shoaib",
  description:
    "Selected projects by Muhammad Shoaib: CRM platforms, React Native apps, AI-assisted workflows, dashboards and storefronts shipped for real teams.",
  icons: {
    icon: [{ url: "/v2/fav-icon.png", type: "image/png" }],
    apple: [{ url: "/v2/fav-icon.png", type: "image/png" }],
  },
};

export default function Work() {
  return (
    <div className={siteFontClass}>
      <SiteShell>
        <WorkPage />
      </SiteShell>
    </div>
  );
}
