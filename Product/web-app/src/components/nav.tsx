"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Search, Zap } from "lucide-react"

const navItems = [
  { name: "Skills", href: "/skills" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Pricing", href: "/pricing" },
  { name: "PAL", href: "/pal" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Zap className="h-6 w-6 text-violet" />
        <span className="font-display font-bold text-xl text-snow">SkillCo</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="flex gap-2">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.name}>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-snow",
                    pathname?.startsWith(item.href)
                      ? "text-snow"
                      : "text-mist"
                  )}
                >
                  {item.name}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-graphite/50 bg-midnight/95 backdrop-blur supports-[backdrop-filter]:bg-midnight/60">
      <div className="container flex h-14 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <button className="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet disabled:pointer-events-none disabled:opacity-50 border-b border-transparent hover:border-violet h-9 py-2 px-0 text-sm font-medium text-mist bg-transparent shadow-none"
            >
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <span className="inline-flex h-full items-center">Search skills...</span>
              <kbd className="pointer-events-none ml-2 hidden h-6 select-none items-center gap-1 rounded border border-graphite bg-slate px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
