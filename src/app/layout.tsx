// src/app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JusticeBench',
  description: 'An R&D Community Platform for AI and Access to Justice',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-white text-black antialiased`}>
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
