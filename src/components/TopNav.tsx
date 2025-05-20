import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 font-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-2xl font-bold text-navy">Justice Bench</span>
            </Link>
          </div>

          <div className="hidden md:flex gap-6 items-center">
            <a href="#tasks" className="text-navy hover:underline">Tasks</a>
            <a href="#projects" className="text-navy hover:underline">Projects</a>
            <a href="#datasets" className="text-navy hover:underline">Datasets</a>
            <div className="relative group">
              <button className="text-navy hover:underline">More ▾</button>
              <div className="absolute hidden group-hover:block bg-white border border-gray-300 shadow-md mt-2 py-2 w-40 z-10">
                <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">About</Link>
                <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Future Page</Link>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6 text-navy" /> : <Menu className="w-6 h-6 text-navy" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 mt-2 pb-4 border-t pt-4">
            <a href="#tasks" className="text-navy hover:underline">Tasks</a>
            <a href="#projects" className="text-navy hover:underline">Projects</a>
            <a href="#datasets" className="text-navy hover:underline">Datasets</a>
            <Link href="/about" className="text-navy hover:underline">About</Link>
          </div>
        )}
      </div>
    </header>
  )
}
