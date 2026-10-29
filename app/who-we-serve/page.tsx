import type { Metadata } from 'next'
import { ogImage } from '@/lib/og'
import CtaBanner from '@/components/CtaBanner'
import WhoWeServe from '@/components/WhoWeServe'
import { PageHero } from '@/components/strata/Page'

export const metadata: Metadata = {
  title: 'Who We Serve — Healthcare, Creators, Startups, Investors and More',
  description: 'Websites, creative and growth marketing for healthcare practices (30 years of experience), creators and influencers, startups raising capital, VC, PE and consulting firms, and businesses in any industry.',
  alternates: { canonical: 'https://www.hewn.life/who-we-serve' },
  openGraph: {
    title: 'Who We Serve — Hewn Life',
    description: 'Healthcare, creators, startups raising capital, investors and consultants, and any business with customers to win.',
    url: 'https://www.hewn.life/who-we-serve',
    images: [ogImage],
  },
}

export default function WhoWeServePage() {
  return (
    <div className="bg-bone text-ink">
      <PageHero
        pill="Who we serve"
        title={<>Built for your world, <em className="accent text-lime">not a template.</em></>}
        lede="Every industry has its own rules, its own buyers and its own bar for quality. Pick yours and see what we build for people like you."
        scene="valley"
        seed={36}
      />
      <WhoWeServe />
      <CtaBanner />
    </div>
  )
}
