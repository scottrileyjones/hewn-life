import Link from 'next/link'
import HewnLogo from './HewnLogo'
import CalButton from './CalButton'
import { CookieSettingsButton } from './CookieConsent'

const columns = [
  {
    title: 'Services',
    links: [
      { href: '/services', label: 'All services' },
      { href: '/services/performance-media', label: 'Performance media' },
      { href: '/services/creative-production', label: 'AI creative' },
      { href: '/services/seo-aeo', label: 'SEO + AEO' },
      { href: '/website-in-a-day', label: 'Website in a day' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/who-we-serve', label: 'Who we serve' },
      { href: '/case-studies', label: 'Case studies' },
      { href: '/dashboard', label: 'Sample dashboard' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/about', label: 'About' },
      { href: '/blog', label: 'Journal' },
      { href: '/contact', label: 'Contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-forest text-mist">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <HewnLogo dark={false} />
            <p className="mt-5 max-w-[18ch] font-display text-[22px] font-medium leading-snug tracking-[-0.02em]">
              Carved from the raw. Built for the future.
            </p>
          </div>

          {columns.map(col => (
            <div key={col.title}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mist/65">{col.title}</p>
              <ul className="grid gap-2">
                {col.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-body text-sm text-mist/85 transition-colors hover:text-lime">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mist/65">Contact</p>
            <a href="mailto:hello@hewn.life" className="block font-body text-sm text-mist/85 transition-colors hover:text-lime">hello@hewn.life</a>
            <CalButton className="mt-2 text-left font-body text-sm text-lime transition-colors hover:text-mist">Book a discovery call →</CalButton>
            <div className="mt-5 flex gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-mist/65 transition-colors hover:text-lime" aria-label="LinkedIn">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-mist/65 transition-colors hover:text-lime" aria-label="Instagram">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-mist/[0.14] pt-6 md:flex-row md:items-center">
          <p className="font-body text-xs leading-relaxed text-mist/65">© {new Date().getFullYear()} Hewn Holdings LLC, doing business as Hewn Life. All rights reserved.<br />285 N Main St #115, Kaysville, UT 84037</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              ['/legal/terms', 'Terms'],
              ['/legal/privacy', 'Privacy'],
              ['/legal/refund', 'Refunds & cancellations'],
              ['/legal/cookies', 'Cookies'],
              ['/legal/results-disclaimer', 'Results disclaimer'],
              ['/legal/accessibility', 'Accessibility'],
              ['/cancel', 'Cancel subscription'],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="font-body text-xs text-mist/65 transition-colors hover:text-mist">{label}</Link>
            ))}
            <CookieSettingsButton className="font-body text-xs text-mist/65 transition-colors hover:text-mist" />
          </div>
        </div>
      </div>
    </footer>
  )
}
