"use client";

import { motion } from "motion/react";
import { 
  MagnifyingGlass, 
  DownloadSimple, 
  Rocket,
  ArrowRight
} from "@phosphor-icons/react";

const steps = [
  {
    number: "01",
    title: "Browse",
    description: "Search skills by category, platform, or use case. Filter by what matters to you.",
    icon: MagnifyingGlass,
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/30",
  },
  {
    number: "02",
    title: "Install",
    description: "One-click add to your agent workspace. No setup required.",
    icon: DownloadSimple,
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/30",
  },
  {
    number: "03",
    title: "Deploy",
    description: "Use instantly or customize for your specific needs.",
    icon: Rocket,
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "border-purple-500/30",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Get started in minutes, not hours
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-px">
                  <div className="w-full h-full bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800" />
                </div>
              )}

              <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${step.color} border ${step.borderColor} backdrop-blur-sm h-full`}>
                {/* Step number */}
                <div className="absolute -top-4 left-8">
                  <span className="text-xs font-mono text-zinc-500 tracking-wider">
                    STEP {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-6">
                  <step.icon weight="fill" className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
