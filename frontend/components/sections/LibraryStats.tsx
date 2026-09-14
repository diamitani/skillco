"use client";

import { motion } from "motion/react";
import { SKILLS, CATEGORIES, CATEGORY_META } from "@/lib/skills";

export function LibraryStats() {
  const counts = CATEGORIES.map((category) => ({
    category,
    count: SKILLS.filter((s) => s.category === category).length,
  }));

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
            The library, at a glance
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto mb-8">
            {SKILLS.length} skills, {CATEGORIES.length} categories — every one a
            real, downloadable SKILL.md file
          </p>
        </motion.div>

        {/* Category counts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {counts.map((item, index) => {
            const meta = CATEGORY_META[item.category] ?? CATEGORY_META["Other"];
            const CategoryIcon = meta.icon;
            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${meta.color} border ${meta.borderColor} backdrop-blur-sm`}
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-4">
                  <CategoryIcon weight="fill" className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white">{item.count}</div>
                <div className="text-sm text-zinc-400 mt-1">{item.category}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
