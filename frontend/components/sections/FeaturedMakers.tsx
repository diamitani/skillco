"use client";

import { motion } from "motion/react";
import Image from "next/image";

const makers = [
  {
    name: "Sarah Chen",
    role: "AI Engineer",
    avatar: "SC",
    skills: 12,
    installs: "45k",
    color: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
  },
  {
    name: "Marcus Johnson",
    role: "Developer",
    avatar: "MJ",
    skills: 8,
    installs: "32k",
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    name: "Emily Park",
    role: "Data Scientist",
    avatar: "EP",
    skills: 15,
    installs: "67k",
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
  },
  {
    name: "David Kim",
    role: "Product Builder",
    avatar: "DK",
    skills: 6,
    installs: "28k",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
  },
];

export function FeaturedMakers() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Made by builders
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto mb-8">
            Join the community creating skills for the future
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">100+</div>
              <div className="text-sm text-zinc-500 mt-1">Skills</div>
            </div>
            <div className="w-px h-12 bg-zinc-800 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
              <div className="text-sm text-zinc-500 mt-1">Creators</div>
            </div>
            <div className="w-px h-12 bg-zinc-800 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">10K+</div>
              <div className="text-sm text-zinc-500 mt-1">Installs</div>
            </div>
          </div>
        </motion.div>

        {/* Maker cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {makers.map((maker, index) => (
            <motion.div
              key={maker.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
            >
              <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${maker.color} border ${maker.borderColor} backdrop-blur-sm transition-all duration-300`}>
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-xl font-bold text-white">
                    {maker.avatar}
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-lg font-semibold text-white mb-1">
                  {maker.name}
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  {maker.role}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/50">
                  <div>
                    <div className="text-lg font-semibold text-white">{maker.skills}</div>
                    <div className="text-xs text-zinc-500">Skills</div>
                  </div>
                  <div className="w-px h-8 bg-zinc-800" />
                  <div>
                    <div className="text-lg font-semibold text-white">{maker.installs}</div>
                    <div className="text-xs text-zinc-500">Installs</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
