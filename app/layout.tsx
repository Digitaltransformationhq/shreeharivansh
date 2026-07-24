import type { Metadata } from "next";
import { Inter, Fraunces, Pinyon_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Fraunces — an elegant modern serif with beautiful italics for the display type
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

// Pinyon Script — a refined calligraphic hand for the artistic wordmark
const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Shree Harivansh — Building Beyond | Architecture & Construction",
  description:
    "Shree Harivansh is an architecture and construction studio designing buildings and spaces that go beyond structure — the art and science of building.",
  keywords: [
    "architecture",
    "construction",
    "interior design",
    "building",
    "Shree Harivansh",
  ],
  openGraph: {
    title: "Shree Harivansh — Building Beyond",
    description:
      "The art and science of designing buildings and non-building structures.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} ${pinyon.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
