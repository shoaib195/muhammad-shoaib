import type { Metadata } from "next";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muhammad Shoaib — Frontend Engineer",
  description:
    "Frontend engineer with 7+ years experience in React, Next.js, React Native, and AI automations.",
  icons: {
    icon: [{ url: "/v2/fav-icon.png", type: "image/png" }],
    apple: [{ url: "/v2/fav-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <AnalyticsBeacon />
      </body>
    </html>
  );
}
