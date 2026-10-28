import Link from 'next/link'
import CalButton from '@/components/CalButton'
import Terrain from './Terrain'
import { Pill } from './Glyph'
import type { SceneName } from '@/lib/strata'

export const btnLight = 'inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-body text-[15px] font-medium text-ink transition hover:bg-mist'
export const btnGlass = 'inline-flex items-center justify-center rounded-full border border-mist/30 bg-mist/10 px-6 py-3.5 font-body text-[15px] font-medium text-mist backdrop-blur transition hover:bg-mist/20'
export const btnForest = 'inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 font-body text-[15px] font-medium text-mist transition hover:bg-forest-2'
export const h2Class = 'font-display font-medium leading-[1.08] tracking-[-0.03em] text-balance'

/** Rounded terrain hero used at the top of every Strata page. */
export function PageHero({
  pill,
  title,
  lede,
  scene = 'amber',
  seed = 12,
  children,
  aside,
}: {
  pill?: string
  title: React.ReactNode
  lede?: React.ReactNode
  scene?: SceneName
  seed?: number
  children?: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-20">
      <section className="relative isolate overflow-hidden rounded-[32px] text-mist">
        <Terrain scene={scene} seed={seed} className="-z-20" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.66) 0%, rgba(20,16,10,.22) 60%, transparent 90%), linear-gradient(0deg, rgba(20,16,10,.4) 0%, transparent 40%)' }} />
        <div className={`grid items-end gap-10 px-6 pb-12 pt-24 lg:px-14 lg:pb-16 lg:pt-32 ${aside ? 'lg:grid-cols-[1.2fr_1fr]' : ''}`}>
          <div>
            {pill && <Pill dark>{pill}</Pill>}
            <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(40px,5.4vw,76px)] font-medium leading-[1.02] tracking-[-0.045em]">{title}</h1>
            {lede && <div className="mt-5 max-w-[36em] font-body text-lg text-mist/80">{lede}</div>}
            {children && <div className="mt-8 flex flex-wrap gap-2.5">{children}</div>}
          </div>
          {aside}
        </div>
      </section>
    </div>
  )
}

/** Pill, heading and supporting line for a section. */
export function SectionHead({ pill, title, lede, center = false, dark = false, className = '' }: { pill?: string; title: React.ReactNode; lede?: React.ReactNode; center?: boolean; dark?: boolean; className?: string }) {
  return (
    <div className={`${center ? 'mx-auto max-w-[720px] text-center' : 'max-w-2xl'} mb-12 ${className}`}>
      {pill && <Pill dark={dark}>{pill}</Pill>}
      <h2 className={`${h2Class} mt-4 text-[clamp(30px,3.6vw,50px)]`}>{title}</h2>
      {lede && <p className={`mt-3.5 font-body text-[17px] ${dark ? 'text-mist/75' : 'text-ink/70'}`}>{lede}</p>}
    </div>
  )
}

/** Forest band in a rounded container. */
export function ForestBand({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <div className="mx-auto max-w-[1400px] px-5">
      <section id={id} className={`rounded-[32px] bg-forest px-5 py-12 text-mist sm:px-12 sm:py-[72px] ${className}`}>{children}</section>
    </div>
  )
}

/** Warm terrain closing panel with the booking CTA. */
export function ClosePanel({
  title = 'Find the layer that’s holding you back.',
  body = 'A free 30-minute call. We grade your nine pillars against the best in class and show you the cheapest gaps to close first.',
  buttonText = 'Book a discovery call',
  secondary,
  seed = 33,
}: {
  title?: React.ReactNode
  body?: React.ReactNode
  buttonText?: string
  secondary?: { href: string; label: string }
  seed?: number
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12">
      <section className="relative isolate flex min-h-[460px] items-end overflow-hidden rounded-[32px] text-mist">
        <Terrain scene="ember" seed={seed} className="-z-20" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, rgba(20,16,10,.62), transparent 75%)' }} />
        <div className="p-7 sm:p-14">
          <Pill dark>Start here</Pill>
          <h2 className={`${h2Class} mt-4 max-w-[16ch] text-[clamp(34px,4.6vw,64px)]`}>{title}</h2>
          <p className="mt-4 max-w-[34em] font-body text-[17px] text-mist/85">{body}</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <CalButton className={btnLight}>{buttonText}</CalButton>
            {secondary && <Link href={secondary.href} className={btnGlass}>{secondary.label}</Link>}
          </div>
        </div>
      </section>
    </div>
  )
}
