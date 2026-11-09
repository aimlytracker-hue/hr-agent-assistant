import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Agent Assistant",
  description: "Evidence-led HR guidance and reviewable workflows using fictional data.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
