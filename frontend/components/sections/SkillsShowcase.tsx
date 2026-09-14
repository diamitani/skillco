"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { FEATURED_SKILLS, CATEGORY_META } from "@/lib/skills";

export function SkillsShowcase() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Featured skills
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            A taste of the library — every skill works with Claude, GPT, Gemini &amp; more
          </p>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURED_SKILLS.map((skill, index) => {
            const meta = CATEGORY_META[skill.category] ?? CATEGORY_META["Other"];
            const SkillIcon = meta.icon;
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={`/marketplace`}>
                  <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${meta.color} border ${meta.borderColor} backdrop-blur-sm hover:border-opacity-50 transition-all duration-300 h-full flex flex-col`}>
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-4">
                      <SkillIcon weight="fill" className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4 flex-grow">
                      {skill.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {skill.platform}
                        </span>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {skill.category}
                        </span>
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">
                        Free
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 font-medium"
          >
            View all skills
            <ArrowRight weight="bold" className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
