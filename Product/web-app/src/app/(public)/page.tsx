"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowUpRight, Sparkles, Zap, Users, Store, Bot, Layers, ChevronRight, Check, ArrowRight, Shield, Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Navigation
function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      {/* Floating Island Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="relative">
          {/* Outer shell - Double bezel */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-full p-1.5 ring-1 ring-white/[0.08]">
            {/* Inner core */}
            <div className="flex items-center gap-1 bg-[#0A0A0B]/90 rounded-full px-2 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 px-4 py-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="font-semibold text-snow hidden sm:block">SkillCo</span>
              </Link>
              
              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-1">
                <NavLink href="/marketplace">Marketplace</NavLink>
                <NavLink href="/skills">Skills</NavLink>
                <NavLink href="/pricing">Pricing</NavLink>
                <NavLink href="/pal">PAL</NavLink>
              </div>
              
              {/* CTA */}
              <div className="flex items-center gap-2 ml-2">
                <Link 
                  href="/login" 
                  className="hidden sm:block px-4 py-2 text-sm text-mist hover:text-snow transition-colors duration-300"
                >
                  Sign in
                </Link>
                <Link 
                  href="/signup"
                  className="group relative flex items-center gap-2 bg-violet hover:bg-vivid text-white text-sm font-medium px-4 py-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  <span>Get Started</span>
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </Link>
                
                {/* Mobile menu button */}
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden p-2 text-mist hover:text-snow transition-colors"
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-3xl md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <MobileNavLink href="/marketplace" onClick={() => setIsOpen(false)} delay={100}>Marketplace</MobileNavLink>
            <MobileNavLink href="/skills" onClick={() => setIsOpen(false)} delay={150}>Skills</MobileNavLink>
            <MobileNavLink href="/pricing" onClick={() => setIsOpen(false)} delay={200}>Pricing</MobileNavLink>
            <MobileNavLink href="/pal" onClick={() => setIsOpen(false)} delay={250}>PAL</MobileNavLink>
            <MobileNavLink href="/login" onClick={() => setIsOpen(false)} delay={300}>Sign in</MobileNavLink>
          </div>
        </div>
      )}
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="px-4 py-2 text-sm text-mist hover:text-snow transition-colors duration-300"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children, onClick, delay }: { href: string; children: React.ReactNode; onClick: () => void; delay: number }) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className="text-4xl font-semibold text-snow/80 hover:text-snow transition-colors duration-300"
      style={{ 
        animation: `slideUp 0.6s ease-out ${delay}ms both`
      }}
    >
      {children}
    </Link>
  )
}

// Hero Section
function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-32 pb-24 overflow-hidden">
      {/* Background mesh gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-violet/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-[100px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Eyebrow tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] ring-1 ring-white/[0.08] mb-8">
          <Shield className="w-4 h-4 text-violet" />
          <span className="text-xs uppercase tracking-[0.2em] text-mist font-medium">Security Verified Skills</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
          <span className="block text-snow">The World's</span>
          <span className="block bg-gradient-to-r from-violet via-vivid to-blue-400 bg-clip-text text-transparent">
            Greatest Skill Library
          </span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-mist max-w-2xl mx-auto mb-12 leading-relaxed">
          A marketplace of skills for every area of work and platform. 
          All scanned for security, all ready to deploy.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/marketplace"
            className="group relative flex items-center gap-3 bg-violet hover:bg-vivid text-white font-medium px-8 py-4 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            <Search className="w-5 h-5" />
            <span>Browse Skills</span>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <Link 
            href="/pal"
            className="flex items-center gap-2 text-mist hover:text-snow font-medium px-6 py-4 transition-colors duration-300"
          >
            <Zap className="w-5 h-5" />
            <span>Build with PAL</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-mist">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Security Scanned</span>
          </div>
          <div className="flex items-center gap-2 text-mist">
            <Download className="w-5 h-5" />
            <span className="text-sm">100K+ Downloads</span>
          </div>
          <div className="flex items-center gap-2 text-mist">
            <Zap className="w-5 h-5" />
            <span className="text-sm">AI-Powered Builder</span>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 bg-violet rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}

// Features Section
function Features() {
  const features = [
    {
      icon: Search,
      title: "Universal Discovery",
      description: "Find skills for any platform, tool, or workflow. From React to Revenue operations.",
      color: "from-violet to-purple-600"
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Every skill is automatically scanned for vulnerabilities with AWS-powered analysis.",
      color: "from-emerald-500 to-teal-400"
    },
    {
      icon: Zap,
      title: "PAL Builder",
      description: "Build skills with natural language. Our AI generates production-ready code.",
      color: "from-amber-500 to-orange-400"
    },
    {
      icon: Store,
      title: "Marketplace",
      description: "Buy and sell skills. Creators keep 70% of revenue. We handle the rest.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: Bot,
      title: "Agent Teams",
      description: "Get AI agents to handle support, marketing, and ops for your skills.",
      color: "from-rose-500 to-pink-400"
    },
    {
      icon: Download,
      title: "Instant Deploy",
      description: "Download skills in seconds. No complex setup, no configuration hell.",
      color: "from-indigo-500 to-violet"
    }
  ]
  
  return (
    <section id="features" className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] ring-1 ring-white/[0.08] mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-mist font-medium">Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-snow">Everything you need to</span>
            <br />
            <span className="bg-gradient-to-r from-violet to-blue-400 bg-clip-text text-transparent">
              discover and build skills
            </span>
          </h2>
          <p className="text-lg text-mist max-w-2xl mx-auto">
            The world's first marketplace with built-in security scanning and AI-powered creation.
          </p>
        </div>
        
        {/* Feature grid - Asymmetrical Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div 
              key={feature.title}
              className={`group relative ${i === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}`}
            >
              {/* Outer shell */}
              <div className="h-full bg-white/[0.02] rounded-[2rem] p-1.5 ring-1 ring-white/[0.06] hover:ring-violet/30 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                {/* Inner core */}
                <div className="h-full bg-slate/50 rounded-[calc(2rem-0.375rem)] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-snow mb-3">{feature.title}</h3>
                  <p className="text-mist leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Browse & Discover",
      description: "Search through thousands of security-verified skills across every category."
    },
    {
      number: "02", 
      title: "Review Security",
      description: "Check security scan results. See vulnerability counts and risk ratings."
    },
    {
      number: "03",
      title: "Download or Buy",
      description: "Free skills require sign-in. Paid skills use Stripe checkout."
    },
    {
      number: "04",
      title: "Build with PAL",
      description: "Pro users can build their own skills with AI and sell them on the marketplace."
    }
  ]
  
  return (
    <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-violet/[0.02] to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] ring-1 ring-white/[0.08] mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-mist font-medium">How It Works</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-snow">
            Four steps to skill mastery
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-violet/40 to-transparent" />
              )}
              
              <div className="text-6xl font-bold text-violet/20 mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold text-snow mb-3">{step.title}</h3>
              <p className="text-mist">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Stats Section
function Stats() {
  const stats = [
    { value: "10,000+", label: "Skills Available" },
    { value: "100%", label: "Security Scanned" },
    { value: "$2M+", label: "Creator Revenue" },
    { value: "50K+", label: "Active Users" },
  ]

  return (
    <section className="relative py-20 px-4 border-y border-white/[0.06]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-snow mb-2">{stat.value}</div>
              <div className="text-sm text-mist">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTA() {
  return (
    <section className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-violet/20 blur-[100px]" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-snow">
            Ready to discover your<br />next skill?
          </h2>
          <p className="text-lg text-mist max-w-2xl mx-auto mb-12">
            Join thousands of developers discovering and building the future of work. Free to start.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/marketplace"
              className="group inline-flex items-center gap-3 bg-violet hover:bg-vivid text-white font-medium px-8 py-4 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
            >
              <Search className="w-5 h-5" />
              <span>Browse Marketplace</span>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link 
              href="/signup"
              className="flex items-center gap-2 text-mist hover:text-snow font-medium px-6 py-4 transition-colors duration-300"
            >
              <span>Create Free Account</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-semibold text-snow">SkillCo</span>
            </div>
            <p className="text-sm text-mist">The world's greatest skill library.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-snow mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-mist">
              <li><Link href="/marketplace" className="hover:text-snow transition-colors">Marketplace</Link></li>
              <li><Link href="/skills" className="hover:text-snow transition-colors">Skills</Link></li>
              <li><Link href="/pal" className="hover:text-snow transition-colors">PAL Builder</Link></li>
              <li><Link href="/pricing" className="hover:text-snow transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-snow mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-mist">
              <li><Link href="/about" className="hover:text-snow transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-snow transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-snow transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-snow mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-mist">
              <li><Link href="/privacy" className="hover:text-snow transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-snow transition-colors">Terms</Link></li>
              <li><Link href="/security" className="hover:text-snow transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-mist">© 2026 SkillCo. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://twitter.com/skillco" className="text-mist hover:text-snow transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://github.com/skillco" className="text-mist hover:text-snow transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Page
export default function Home() {
  return (
    <main>
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(48px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Nav />
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}
