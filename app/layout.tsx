import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans, Inter_Tight, Playfair_Display } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['italic'],
  variable: '--font-accent',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hewn.life'),
  title: 'Hewn Life — Carved from the raw. Built for the future.',
  description: 'Premium AI-era marketing agency combining thirty years of human business acumen with the speed and scale of AI. Flat fees. Full transparency.',
  openGraph: {
    title: 'Hewn Life — AI-Era Marketing Agency',
    description: 'Thirty years of human business acumen. The speed and scale of AI. Premium full-service marketing at a fraction of the traditional cost.',
    url: 'https://www.hewn.life',
    siteName: 'Hewn Life',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hewn Life — AI-Era Marketing Agency',
    description: 'Thirty years of human business acumen. The speed and scale of AI. Premium full-service marketing at a fraction of the traditional cost.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable} ${interTight.variable} ${playfair.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  )
}
