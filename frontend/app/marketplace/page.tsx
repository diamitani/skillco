"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  MagnifyingGlass,
  Faders,
  ArrowRight,
  DownloadSimple,
  Star,
} from "@phosphor-icons/react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { SKILLS, CATEGORIES, CATEGORY_META } from "@/lib/skills";

const categories = ["All", ...CATEGORIES];
const sortOptions = ["Popular", "Newest", "Rating", "Name"];
const priceOptions = ["All", "Free", "Paid"];

function formatInstalls(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("Popular");
  const [activePrice, setActivePrice] = useState("All");

  const filteredSkills = SKILLS.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || skill.category === activeCategory;
    const matchesPrice = activePrice === "All" || skill.price === activePrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    switch (activeSort) {
      case "Popular":
        return b.installs - a.installs;
      case "Rating":
        return b.rating - a.rating;
      case "Name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <>
      <Nav />
      <main className="flex-1 pt-24">
        {/* Header */}
        <section className="relative py-16 md:py-24 border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                Browse skills
              </h1>
              <p className="text-lg text-zinc-400 max-w-lg mx-auto">
                {SKILLS.length} LLM-agnostic skills — every one works with Claude, GPT, Gemini &amp; more
              </p>
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="relative">
                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-20 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Category filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activeCategory === category
                        ? "bg-zinc-800 text-white"
                        : "bg-transparent text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex-1" />

              {/* Sort */}
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-700"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    Sort by {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Skills grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-zinc-400 text-sm">
                {sortedSkills.length} skill{sortedSkills.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {sortedSkills.map((skill, index) => {
                  const meta = CATEGORY_META[skill.category] ?? CATEGORY_META["Other"];
                  const SkillIcon = meta.icon;
                  return (
                    <motion.div
                      key={skill.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="group"
                    >
                      <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${meta.color} border ${meta.borderColor} backdrop-blur-sm hover:border-opacity-50 transition-all duration-300 h-full flex flex-col`}>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
                            <SkillIcon weight="fill" className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex items-center gap-1 text-zinc-400">
                            <Star weight="fill" className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium">{skill.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                          {skill.name}
                        </h3>
                        <p className="text-zinc-400 text-sm mb-2 flex-grow">
                          {skill.description}
                        </p>
                        <p className="text-xs text-zinc-500 mb-4">
                          Works with Claude, GPT, Gemini &amp; more
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                              {skill.platform}
                            </span>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                              {skill.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-500">
                            <DownloadSimple weight="bold" className="w-3.5 h-3.5" />
                            <span className="text-xs">{formatInstalls(skill.installs)}</span>
                          </div>
                        </div>

                        {/* Install button */}
                        <button className="mt-4 w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-medium hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                          <DownloadSimple weight="bold" className="w-4 h-4" />
                          Install
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Empty state */}
            {sortedSkills.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlass className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No skills found</h3>
                <p className="text-zinc-400">Try adjusting your filters or search query</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
