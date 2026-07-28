import "./globals.css"
import { SiteHeader } from "@/components/nav"

export const metadata = {
  title: "SkillCo — The World's Greatest Skill Library",
  description: "A marketplace of skills for every area of work and platform. Build, discover, and sell skills.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-midnight antialiased">
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}
