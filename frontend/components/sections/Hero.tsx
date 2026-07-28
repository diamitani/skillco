"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkle, Play } from "@phosphor-icons/react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium tracking-wide uppercase">
            <Sparkle weight="fill" className="w-3 h-3 text-indigo-400" />
            AI Skills Marketplace
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6"
        >
          Skills for{" "}
          <span className="gradient-text">every agent</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Browse, build, and deploy AI skills for Claude, Codex, Hermes, and OpenClaw. 
          From code generation to data analysis—get more from your agents.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/marketplace"
            className="group inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-zinc-200 transition-all duration-200"
          >
            Browse marketplace
            <ArrowRight weight="bold" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#"
            className="group inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 px-6 py-4"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
              <Play weight="fill" className="w-4 h-4 text-white ml-0.5" />
            </div>
            <span className="font-medium">See how it works</span>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-zinc-900"
        >
          <p className="text-sm text-zinc-500 mb-6">Works with leading AI platforms</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {["Claude", "Codex", "Hermes", "OpenClaw"].map((platform) => (
              <div
                key={platform}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold">
                  {platform[0]}
                </div>
                <span className="text-sm font-medium">{platform}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-zinc-800 flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
