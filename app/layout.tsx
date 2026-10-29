import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans, Inter_Tight, Playfair_Display } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import QuizPopup from '@/components/QuizPopup'
import GoogleTagManager, { GoogleTagManagerNoScript } from '@/components/GoogleTagManager'

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
  title: {
    default: 'Hewn Life — AI-Era Marketing Agency',
    template: '%s | Hewn Life',
  },
  description: 'Premium AI-era marketing agency combining thirty years of human business acumen with the speed and scale of AI. Flat fees. Full transparency.',
  alternates: {
    canonical: 'https://www.hewn.life',
  },
  openGraph: {
    title: 'Hewn Life — Your new growth team. One flat fee.',
    description: 'Senior strategy, 20–40 creative assets a week and a live dashboard that grades every dollar. Monthly plans from $2,500, or a website in a day for $999.',
    url: 'https://www.hewn.life',
    siteName: 'Hewn Life',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hewn Life — Your new growth team. One flat fee.',
    description: 'Senior strategy, 20–40 creative assets a week and a live dashboard that grades every dollar. Monthly plans from $2,500, or a website in a day for $999.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable} ${interTight.variable} ${playfair.variable}`}>
      <head>
        <GoogleTagManager />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MarketingAgency',
              name: 'Hewn Life',
              url: 'https://www.hewn.life',
              logo: 'https://www.hewn.life/images/hewn-logo.png',
              description: 'Premium AI-era marketing agency combining thirty years of human business acumen with the speed and scale of AI.',
              address: { '@type': 'PostalAddress', addressCountry: 'US' },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                url: 'https://www.hewn.life/contact',
              },
              sameAs: [],
              priceRange: '$$',
              areaServed: 'US',
            }),
          }}
        />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
        <QuizPopup />
      </body>
    </html>
  )
}
