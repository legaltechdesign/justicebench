// src/app/layout.tsx
import './globals.css'
import { Geist, Geist_Mono, League_Spartan } from 'next/font/google'
import Link from 'next/link'
import type { Metadata } from 'next'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const spartan = League_Spartan({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-league-spartan',
})

export const metadata: Metadata = {
  title: 'JusticeBench',
  description: 'An R&D Community Platform for AI and Access to Justice',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable} ${spartan.variable}`}>
      <body className="font-sans bg-white text-black antialiased">
        <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="text-2xl font-bold text-navy font-heading hover:underline">
              JusticeBench
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
