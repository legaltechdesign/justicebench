"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80">
          <span className="text-2xl font-bold text-navy font-heading">JusticeBench</span>
        </Link>
        <button
          className="sm:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
        <div className={`sm:flex gap-6 ${isOpen ? "block" : "hidden"}`}>
          <Link href="#tasks" className="block py-2 text-navy font-heading hover:underline">Tasks</Link>
          <Link href="#projects" className="block py-2 text-navy font-heading hover:underline">Projects</Link>
          <Link href="#datasets" className="block py-2 text-navy font-heading hover:underline">Datasets</Link>
          <div className="relative group">
            <span className="block py-2 text-navy font-heading cursor-pointer hover:underline">More</span>
            <div className="absolute hidden group-hover:block bg-white shadow p-2 mt-1">
              <Link href="/about" className="block px-4 py-2 hover:bg-gray-100">About</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
