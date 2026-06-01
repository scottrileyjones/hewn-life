'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HewnLogo from './HewnLogo'
import CalButton from './CalButton'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/website-in-a-week', label: 'Site in a Week' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const darkHero = !scrolled && ['/about', '/contact', '/pricing'].includes(pathname)

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 h-16 md:h-18 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md border-b border-black/[0.06]' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <HewnLogo dark={!darkHero} />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                  darkHero
                    ? pathname === link.href ? 'text-white' : 'text-white/50 hover:text-white'
                    : pathname === link.href ? 'text-[#0D0D0D]' : 'text-[#0D0D0D]/50 hover:text-[#0D0D0D]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://hewnlife.myassembly.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-body text-sm font-medium px-5 py-2.5 rounded-full border transition-all duration-200 ${
                darkHero
                  ? 'border-white/30 text-white/70 hover:border-white/60 hover:text-white'
                  : 'border-black/15 text-[#0D0D0D]/70 hover:border-black/30 hover:text-[#0D0D0D]'
              }`}
            >
              Client Login
            </a>
            <CalButton className={`font-body text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 ${
              darkHero ? 'bg-white text-[#0D0D0D] hover:bg-white/90' : 'bg-[#0D0D0D] text-white hover:bg-[#222]'
            }`}>
              Book a Call
            </CalButton>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-[1.5px] transition-all duration-300 ${darkHero ? 'bg-white' : 'bg-[#0D0D0D]'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-[1.5px] transition-all duration-300 ${darkHero ? 'bg-white' : 'bg-[#0D0D0D]'} ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] transition-all duration-300 ${darkHero ? 'bg-white' : 'bg-[#0D0D0D]'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-10 md:hidden">
          <HewnLogo size="lg" />
          <div className="flex flex-col items-center gap-8 mt-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display font-bold text-3xl text-[#0D0D0D] hover:text-[#6BAD3D] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://hewnlife.myassembly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-bold text-3xl text-[#0D0D0D]/40 hover:text-[#0D0D0D] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Client Login
            </a>
          </div>
          <CalButton
            className="mt-4 bg-[#0D0D0D] text-white font-body font-medium px-8 py-4 rounded-full hover:bg-[#222] transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Book a Call
          </CalButton>
        </div>
      )}
    </>
  )
}
