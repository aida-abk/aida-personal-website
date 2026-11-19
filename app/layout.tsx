import type { Metadata, Viewport } from "next";
import { Golos_Text, Prata, PT_Mono } from "next/font/google";
// Golos Text has no Greek. This file holds Greek letters only, for the few on
// the Projects page (β, ε); all other text skips it.
import "@fontsource/gfs-didot/greek-400.css";
import "./globals.css";

// The text face. Drawn in Russia for reading on screens; it covers Russian
// and Kazakh Cyrillic. The files are downloaded at build time and served
// from this site.
const text = Golos_Text({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-text",
  display: "swap",
});

// For labels, numbers and dates: the monospace of the labels on Aida's slides.
const mono = PT_Mono({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-mono",
  display: "swap",
});

// Used for the name only. A serif with hairline-thin strokes: the hardest
// black-and-white contrast on the page.
const name = Prata({
  weight: "400",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-name",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Aida Abkenova", template: "%s · Aida Abkenova" },
  description:
    "Aida Abkenova. Computational Neuroscience and Applied Mathematics, Brown University, class of 2028.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${text.variable} ${mono.variable} ${name.variable}`}>
      <body>{children}</body>
    </html>
  );
}
