"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { 
  GithubLogo, 
  TwitterLogo, 
  DiscordLogo,
  ArrowRight
} from "@phosphor-icons/react";

const footerLinks = {
  Product: [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Builder", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Changelog", href: "#" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Guides", href: "#" },
    { name: "Blog", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Press", href: "#" },
  ],
  Legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Security", href: "#" },
  ],
};

const socialLinks = [
  { name: "GitHub", icon: GithubLogo, href: "#" },
  { name: "Twitter", icon: TwitterLogo, href: "#" },
  { name: "Discord", icon: DiscordLogo, href: "#" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">Skillco</span>
            </Link>
            <p className="text-zinc-400 text-sm mb-6 max-w-xs">
              The marketplace for AI skills. Browse, build, and deploy for Claude, Codex, Hermes, and OpenClaw.
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200"
                  aria-label={social.name}
                >
                  <social.icon weight="fill" className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Skillco. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
            >
              Status
            </Link>
            <Link
              href="#"
              className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
