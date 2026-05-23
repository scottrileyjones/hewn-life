'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HewnLogo from './HewnLogo'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 h-16 md:h-20 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-md bg-obsidian/80 border-b border-white/[0.08]' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <HewnLogo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-[12px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                  pathname === link.href ? 'text-cream' : 'text-ash hover:text-cream'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="border border-copper text-copper font-mono text-[12px] uppercase tracking-[0.16em] px-5 py-2.5 rounded-full hover:bg-copper hover:text-obsidian transition-all duration-300"
            >
              Book a Call
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-cream p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-[1.5px] bg-cream transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-[1.5px] bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] bg-cream transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-obsidian z-40 flex flex-col items-center justify-center gap-10 md:hidden">
          <HewnLogo size="lg" />
          <div className="flex flex-col items-center gap-8 mt-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-3xl text-cream hover:text-ember transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-4 border border-copper text-copper font-mono text-[12px] uppercase tracking-[0.18em] px-8 py-4 rounded-full hover:bg-copper hover:text-obsidian transition-all duration-300"
            onClick={() => setMenuOpen(false)}
          >
            Book a Call
          </Link>
        </div>
      )}
    </>
  )
}
