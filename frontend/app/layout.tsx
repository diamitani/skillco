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
  title: "Skillco | AI Skills Marketplace",
  description: "Browse, build, and deploy AI skills for Claude, Codex, Hermes, and OpenClaw. The marketplace for agent capabilities.",
  keywords: ["AI skills", "Claude", "Codex", "Hermes", "OpenClaw", "agent marketplace", "AI tools"],
  openGraph: {
    title: "Skillco | AI Skills Marketplace",
    description: "Browse, build, and deploy AI skills for Claude, Codex, Hermes, and OpenClaw.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">{children}</body>
    </html>
  );
}
