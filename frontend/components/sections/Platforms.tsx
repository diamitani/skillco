"use client";

import { motion } from "motion/react";

const platforms = [
  {
    name: "Claude",
    description: "Advanced reasoning and analysis",
    color: "from-orange-500/20 to-amber-500/20",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-400",
  },
  {
    name: "Codex",
    description: "Powerful code generation",
    color: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400",
  },
  {
    name: "Hermes",
    description: "Open-source flexibility",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
  },
  {
    name: "OpenClaw",
    description: "Local-first agent framework",
    color: "from-purple-500/20 to-violet-500/20",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-400",
  },
];

export function Platforms() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Works with your agents
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            One marketplace, every platform
          </p>
        </motion.div>

        {/* Platform cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`group relative p-6 rounded-2xl bg-gradient-to-br ${platform.color} border ${platform.borderColor} backdrop-blur-sm transition-all duration-300 cursor-pointer`}
            >
              {/* Platform badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${platform.textColor}`}>
                    {platform.name[0]}
                  </span>
                </div>
                <span className="text-lg font-semibold text-white">
                  {platform.name}
                </span>
              </div>

              {/* Description */}
              <p className="text-zinc-400 text-sm">
                {platform.description}
              </p>

              {/* Hover indicator */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`w-8 h-8 rounded-full ${platform.borderColor} border flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${platform.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
