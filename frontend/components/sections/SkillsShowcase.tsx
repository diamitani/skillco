"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  Code, 
  FileText, 
  Database, 
  PaintBrush, 
  MagnifyingGlass,
  Lightning,
  ArrowRight,
  DownloadSimple,
  Star
} from "@phosphor-icons/react";

const platforms = ["All", "Claude", "Codex", "Hermes", "OpenClaw"];

const skills = [
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    description: "Automated code review with best practices, security checks, and style enforcement.",
    platform: "Claude",
    category: "Code",
    installs: 12400,
    rating: 4.9,
    icon: Code,
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/30",
  },
  {
    id: "doc-writer",
    name: "Doc Writer",
    description: "Generate comprehensive documentation from code, APIs, and project structure.",
    platform: "Codex",
    category: "Writing",
    installs: 8900,
    rating: 4.8,
    icon: FileText,
    color: "from-emerald-500/20 to-emerald-600/20",
    borderColor: "border-emerald-500/30",
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Analyze datasets, generate insights, and create visualizations from raw data.",
    platform: "Hermes",
    category: "Data",
    installs: 6700,
    rating: 4.7,
    icon: Database,
    color: "from-amber-500/20 to-amber-600/20",
    borderColor: "border-amber-500/30",
  },
  {
    id: "ui-designer",
    name: "UI Designer",
    description: "Generate UI components, layouts, and design systems from requirements.",
    platform: "OpenClaw",
    category: "Design",
    installs: 5400,
    rating: 4.8,
    icon: PaintBrush,
    color: "from-purple-500/20 to-purple-600/20",
    borderColor: "border-purple-500/30",
  },
  {
    id: "research-assistant",
    name: "Research Assistant",
    description: "Deep research on any topic with source citations and structured summaries.",
    platform: "Claude",
    category: "Research",
    installs: 11200,
    rating: 4.9,
    icon: MagnifyingGlass,
    color: "from-rose-500/20 to-rose-600/20",
    borderColor: "border-rose-500/30",
  },
  {
    id: "api-builder",
    name: "API Builder",
    description: "Design and build RESTful APIs with OpenAPI specs and documentation.",
    platform: "Codex",
    category: "Code",
    installs: 7800,
    rating: 4.6,
    icon: Lightning,
    color: "from-cyan-500/20 to-cyan-600/20",
    borderColor: "border-cyan-500/30",
  },
];

function formatInstalls(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function SkillsShowcase() {
  const [activePlatform, setActivePlatform] = useState("All");

  const filteredSkills = activePlatform === "All" 
    ? skills 
    : skills.filter(skill => skill.platform === activePlatform);

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
            Popular skills
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Discover skills built by the community for every use case
          </p>
        </motion.div>

        {/* Platform tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex p-1 rounded-full bg-zinc-900 border border-zinc-800">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activePlatform === platform
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSkills.map((skill, index) => (
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
                <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${skill.color} border ${skill.borderColor} backdrop-blur-sm hover:border-opacity-50 transition-all duration-300 h-full flex flex-col`}>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-4">
                    <skill.icon weight="fill" className="w-6 h-6 text-white" />
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
                    <div className="flex items-center gap-1 text-zinc-500">
                      <DownloadSimple weight="bold" className="w-3.5 h-3.5" />
                      <span className="text-xs">{formatInstalls(skill.installs)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
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
