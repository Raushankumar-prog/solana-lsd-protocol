'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletButton } from './solana/solana-provider'
import { cn } from '@/lib/utils'
import { Rocket, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function AppLayout({ children, links }: { children: ReactNode; links: { label: string; path: string }[] }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Glass Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20 transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary fill-primary" />
            <Link href="/" className="text-xl font-bold tracking-tight">
              LSD<span className="text-primary">Protocol</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/5",
                  pathname === link.path
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Wallet Action */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <WalletButton />
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 text-muted-foreground hover:text-white">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-black/95 border-l border-white/10 backdrop-blur-2xl shadow-2xl p-6">
                  <div className="flex flex-col gap-8 mt-8">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-6 h-6 text-primary fill-primary" />
                      <span className="text-xl font-bold">LSD Protocol</span>
                    </div>
                    <nav className="flex flex-col gap-4">
                      {links.map((link) => (
                        <Link
                          key={link.path}
                          href={link.path}
                          className={cn(
                            "text-lg font-medium transition-colors hover:text-primary",
                            pathname === link.path ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-4">
                      <WalletButton />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Spacer for Fixed Header */}
      <main className="flex-grow pt-24 px-4 container mx-auto fade-in">
        {children}
      </main>

      {/* Professional Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md mt-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">LSD Protocol</span>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              The next generation of liquid staking on Solana.
              Built for speed, security, and yield maximization.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Staking</Link></li>
              <li><Link href="/analytics" className="hover:text-primary transition-colors">Analytics</Link></li>
              <li><Link href="/validators" className="hover:text-primary transition-colors">Validators</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Audits</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
          © 2024 LSD Protocol. All rights reserved. Built on Solana.
        </div>
      </footer>
    </div>
  )
}
