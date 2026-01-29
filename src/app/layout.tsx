// src/app/layout.tsx
import './globals.css'
import { Geist, Geist_Mono, League_Spartan } from 'next/font/google'
import TopNav from '@/components/TopNav'
import type { Metadata } from 'next'

// ✅ add these
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

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
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable} ${spartan.variable}`}>
      <body className="font-sans bg-white text-black antialiased">
        <TopNav />
        {children}

        {/* ✅ Vercel Analytics + Speed Insights */}
        <Analytics />
        <SpeedInsights />

        <footer className="bg-gray-100 border-t mt-12 text-sm text-gray-700 px-6 py-8 font-sans">
          <div className="max-w-6xl mx-auto space-y-3">
            <p>
              &copy; 2025,{' '}
              <a
                href="https://justiceinnovation.law.stanford.edu/projects/ai-access-to-justice/"
                className="text-navy underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Stanford Legal Design Lab
              </a>
              . All rights reserved.
            </p>
            <p className="text-gray-600">
              This site provides resources to legal providers, but is not meant for people
              seeking help for legal problems. If you are looking for legal help,{' '}
              <a href="https://www.lawhelp.org/">please visit this website to find groups that can help you.</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
