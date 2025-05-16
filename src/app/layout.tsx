// src/app/layout.tsx
import './globals.css'
import { Geist, Geist_Mono, League_Spartan } from 'next/font/google'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import Head from 'next/head'

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
  icons: {
    icon: '/favicon.ico', // or '/favicon.ico'
  },
}




export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <html lang="en" className={`${geist.variable} ${mono.variable} ${spartan.variable}`}>
        <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="font-sans bg-white text-black antialiased">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
  <div className="max-w-7xl mx-auto flex items-center gap-4">
    <Link href="/" className="flex items-center gap-2 hover:opacity-80">
      <Image
        src="/favicon.png" // or your specific image path
        alt="Justice Bench Logo"
        width={32}
        height={32}
        className="rounded"
      />
      <span className="text-2xl font-bold text-navy font-heading">JusticeBench</span>
    </Link>
  </div>
</nav>

        {children}
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
      This site provides resources to legal providers, but is not meant for people seeking help for legal problems. If you are looking for legal help, <a href="https://www.lawhelp.org/">please visit this website to find groups that can help you.</a>
    </p>
  </div>
</footer>

      </body>
    </html>
  )
}
