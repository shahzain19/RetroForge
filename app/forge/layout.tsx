import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forge",
  description:
    "Downscale, palette-match, and dither any image into authentic retro game assets.",
};

export default function ForgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden">
      {children}
    </div>
  );
}
