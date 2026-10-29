'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HewnLogo from './HewnLogo'
import CalButton from './CalButton'

const navLinks = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/services', label: 'Services' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Journal' },
]

// Older pages that still open on a dark hero.
const DARK_HERO: string[] = []

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const darkHero = !scrolled && DARK_HERO.includes(pathname)

  return (
    <>
      <nav className={`fixed top-0 z-50 h-16 w-full transition-all duration-300 ${
        scrolled ? 'border-b border-ink/[0.06] bg-bone/90 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-5 px-5">
          <HewnLogo dark={!darkHero} />

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map(link => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-body text-sm transition-colors duration-200 ${
                    darkHero
                      ? active ? 'text-white' : 'text-white/60 hover:text-white'
                      : active ? 'text-ink' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="https://hewnlife.myassembly.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-body text-sm transition-colors ${darkHero ? 'text-white/70 hover:text-white' : 'text-ink/60 hover:text-ink'}`}
            >
              Client login
            </a>
            <CalButton className={`rounded-full px-[18px] py-2.5 font-body text-sm font-medium transition-all duration-200 ${
              darkHero ? 'bg-white text-ink hover:bg-mist' : 'bg-forest text-mist hover:bg-forest-2'
            }`}>
              Book a call
            </CalButton>
          </div>

          <button
            className="p-2 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className="flex w-6 flex-col gap-1.5">
              <span className={`block h-[1.5px] transition-all duration-300 ${darkHero ? 'bg-white' : 'bg-ink'} ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-[1.5px] transition-all duration-300 ${darkHero ? 'bg-white' : 'bg-ink'} ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] transition-all duration-300 ${darkHero ? 'bg-white' : 'bg-ink'} ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-bone lg:hidden">
          <HewnLogo size="lg" />
          <div className="mt-4 flex flex-col items-center gap-7">
            {[{ href: '/', label: 'Home' }, ...navLinks].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-3xl font-medium tracking-[-0.03em] text-ink transition-colors hover:text-forest"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://hewnlife.myassembly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-3xl font-medium tracking-[-0.03em] text-ink/40 transition-colors hover:text-ink"
              onClick={() => setMenuOpen(false)}
            >
              Client login
            </a>
          </div>
          <CalButton
            className="mt-2 rounded-full bg-forest px-8 py-4 font-body font-medium text-mist transition-all duration-200 hover:bg-forest-2"
            onClick={() => setMenuOpen(false)}
          >
            Book a call
          </CalButton>
        </div>
      )}
    </>
  )
}
