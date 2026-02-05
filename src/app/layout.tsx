import { Manrope } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/app-layout'
import React from 'react'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LSD Protocol',
  description: 'Liquid Staking Derivative on Solana',
}

const links: { label: string; path: string }[] = [
  // More links...
  { label: 'Home', path: '/' },

  { label: 'Launch App', path: '/dashboard' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Validators', path: '/validators' },
  { label: 'Admin', path: '/admin' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.className} antialiased`}>
        <div className="aurora-bg">
          <div className="aurora-blob blob-1"></div>
          <div className="aurora-blob blob-2"></div>
          <div className="aurora-blob blob-3"></div>
        </div>
        <AppProviders>
          <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
