import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RetroForge — Retro Texture Downscaler & Palette Matcher",
    template: "%s | RetroForge",
  },
  description:
    "Convert modern images into authentic retro game assets with custom downscaling, palette matching, and Floyd-Steinberg dithering. Runs entirely in your browser.",
  keywords: [
    "retro",
    "pixel art",
    "texture downscaler",
    "palette matcher",
    "dithering",
    "game assets",
    "PS1",
    "GBA",
    "SNES",
    "Game Boy",
  ],
  openGraph: {
    title: "RetroForge — Retro Texture Downscaler",
    description:
      "Convert modern images into authentic retro game assets. Runs entirely in your browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
