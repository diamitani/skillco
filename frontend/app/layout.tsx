import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const TITLE = "SkillCo | Skills that work.";
const DESCRIPTION =
  "The skill index for AI agents. Browse ready-to-install skills, download one, and drop it into your agent.";

export const metadata: Metadata = {
  metadataBase: new URL("https://skillco.work"),
  title: {
    default: TITLE,
    template: "%s | SkillCo",
  },
  description: DESCRIPTION,
  applicationName: "SkillCo",
  keywords: [
    "AI skills",
    "agent skills",
    "SKILL.md",
    "Claude",
    "Codex",
    "Hermes",
    "OpenClaw",
    "skill index",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "SkillCo",
    type: "website",
    url: "https://skillco.work",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0E1A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">{children}</body>
    </html>
  );
}
