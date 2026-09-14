"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CaretDown, 
  List, 
  X,
  Sparkle,
  Code,
  Robot,
  PuzzlePiece,
  BookOpen,
  ArrowRight
} from "@phosphor-icons/react";

const navLinks = [
  {
    name: "Marketplace",
    href: "/marketplace",
    description: "Browse AI skills"
  },
  {
    name: "Full library",
    href: "/downloads/skill-library-full.zip",
    description: "Download all 369 skills as a zip"
  },
];

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <nav className="glass rounded-2xl px-6 h-16 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkle weight="fill" className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Skillco</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/marketplace"
              className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors duration-200"
            >
              Get started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? (
              <X weight="bold" className="w-6 h-6" />
            ) : (
              <List weight="bold" className="w-6 h-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-4 mt-2"
          >
            <div className="glass rounded-2xl p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-zinc-300 hover:text-white transition-colors py-2"
                >
                  <div className="font-medium">{link.name}</div>
                  <div className="text-sm text-zinc-500">{link.description}</div>
                </Link>
              ))}
              <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
                <Link
                  href="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-white text-black px-4 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors"
                >
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
