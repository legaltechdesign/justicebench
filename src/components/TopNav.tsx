"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleNav = (hash: string) => {
    window.location.href = `/${hash}`;
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
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

        <div className={`sm:flex gap-6 items-center ${isOpen ? "block" : "hidden"}`}>
          <button onClick={() => handleNav("#tasks")} className="block py-2 text-navy font-heading hover:underline">
            Tasks
          </button>
          <button onClick={() => handleNav("#projects")} className="block py-2 text-navy font-heading hover:underline">
            Projects
          </button>
          <button onClick={() => handleNav("#datasets")} className="block py-2 text-navy font-heading hover:underline">
            Datasets
          </button>

          {/* Persistent Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowMore(true)}
            onMouseLeave={() => setShowMore(false)}
          >
            <span className="block py-2 text-navy font-heading cursor-pointer hover:underline">
              More
            </span>

            <div
              className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 transition-all duration-150 ease-in-out ${
                showMore ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <Link
                href="/about"
                className="block px-4 py-2 text-sm text-navy hover:bg-gray-100"
              >
                About JusticeBench
              </Link>
              <Link
                href="/privacy"
                className="block px-4 py-2 text-sm text-navy hover:bg-gray-100"
              >
                Privacy and Terms of Use
              </Link>
              {/* Add more sub-links if needed */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
