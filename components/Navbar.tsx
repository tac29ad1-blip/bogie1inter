"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#hero", label: "หน้าแรก" },
  { href: "#products", label: "สินค้า" },
  { href: "#about", label: "เกี่ยวกับเรา" },
  { href: "#contact", label: "ติดต่อ" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#2e2e2e]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-widest text-[#4a7c59] group-hover:text-[#5d9e70] transition-colors uppercase">
              BOGIE.1
            </span>
            <span className="text-xs font-semibold tracking-wider text-[#888888] uppercase hidden sm:block">
              INTER
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#ededed] hover:text-[#4a7c59] transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side: Line OA CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            <a
              href="https://line.me/ti/p/~@bogie1"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold text-[#0a0a0a] bg-[#4a7c59] hover:bg-[#5d9e70] transition-colors"
            >
              <span>Line</span>
              <span className="font-mono text-xs">@bogie1</span>
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded hover:bg-[#1e1e1e] transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-0.5 bg-[#ededed] transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-[#ededed] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-[#ededed] transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#2e2e2e] py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-2 py-2 text-sm font-medium text-[#ededed] hover:text-[#4a7c59] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://line.me/ti/p/~@bogie1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-semibold text-[#0a0a0a] bg-[#4a7c59] hover:bg-[#5d9e70] transition-colors"
            >
              Line OA: @bogie1
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
