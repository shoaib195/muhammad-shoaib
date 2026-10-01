import { Caveat, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-site-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-site-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-site-hand",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-site-display",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

/** Class list that exposes all site font variables. */
export const siteFontClass = `${geist.variable} ${geistMono.variable} ${caveat.variable} ${instrument.variable}`;
