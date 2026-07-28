"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkle } from "@phosphor-icons/react";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent" />
      
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-8">
            <Sparkle weight="fill" className="w-8 h-8 text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            Start building{" "}
            <span className="gradient-text">smarter</span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto mb-10">
            Join developers using skills to ship faster
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketplace"
              className="group inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-zinc-200 transition-all duration-200"
            >
              Browse free skills
              <ArrowRight weight="bold" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 font-medium px-6 py-4"
            >
              Read the docs
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
