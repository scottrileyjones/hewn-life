import type { Metadata } from 'next'
import Terrain from '@/components/strata/Terrain'
import { Mark } from '@/components/strata/Glyph'
import { colors, type SceneName } from '@/lib/strata'
import { launchSlides } from '@/components/brand/LaunchCarousel'

export const metadata: Metadata = {
  title: 'Social assets',
  robots: { index: false, follow: false },
}

/**
 * Profile pictures, covers and a launch post for every social account, each
 * drawn at the platform's exact pixel size. Screenshot an element by its id to
 * export it (see each asset's label for the size).
 */

function Wordmark({ size, light = true }: { size: number; light?: boolean }) {
  return (
    <span className="font-display font-semibold leading-none tracking-[0.02em]" style={{ fontSize: size, color: light ? '#F4F2EC' : colors.ink }}>
      hewn<span className="accent" style={{ color: colors.lichen }}>life</span>
    </span>
  )
}

function Lockup({ mark, word, light = true }: { mark: number; word: number; light?: boolean }) {
  return (
    <div className="flex items-center" style={{ gap: mark * 0.35 }}>
      <Mark fg={light ? '#F4F2EC' : colors.ink} accent={colors.lichen} size={mark} />
      <Wordmark size={word} light={light} />
    </div>
  )
}

/**
 * A terrain banner with the lockup, line and URL kept inside the platform's safe area.
 * `centered` puts the text in the middle column; `top` pins it that many px from the top
 * (Facebook overlays the profile picture on the bottom centre of the cover).
 */
function Banner({ id, w, h, scene, seed, safe, mark, word, line, centered = false, top }: {
  id: string; w: number; h: number; scene: SceneName; seed: number
  safe: { w: number; h: number }; mark: number; word: number; line: number
  centered?: boolean; top?: number
}) {
  const box = top === undefined
    ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
    : 'left-1/2 -translate-x-1/2'
  return (
    <div id={id} className="relative isolate overflow-hidden" style={{ width: w, height: h }}>
      <Terrain scene={scene} seed={seed} className="-z-20" />
      <div className="absolute inset-0 -z-10" style={{ background: centered ? 'radial-gradient(ellipse at 50% 35%, rgba(14,10,6,.55), rgba(14,10,6,.15) 70%)' : 'linear-gradient(90deg, rgba(14,10,6,.62), rgba(14,10,6,.15) 70%)' }} />
      <div className={`absolute flex flex-col justify-center ${box} ${centered ? 'items-center text-center' : ''}`} style={{ width: safe.w, height: safe.h, ...(top !== undefined ? { top } : {}) }}>
        <Lockup mark={mark} word={word} />
        <p className="font-display font-medium leading-tight tracking-[-0.03em] text-mist" style={{ fontSize: line, marginTop: line * 0.5 }}>
          AI runs the engine. <span className="accent" style={{ color: colors.lime }}>You drive.</span>
        </p>
        <p className="font-mono uppercase tracking-[0.2em] text-mist/75" style={{ fontSize: Math.max(12, line * 0.38), marginTop: line * 0.45 }}>Marketing for growing businesses · hewn.life</p>
      </div>
    </div>
  )
}

const assets: { label: string; node: React.ReactNode }[] = [
  {
    label: 'profile-forest-1080 · Profile picture (all platforms), 1080×1080',
    node: (
      <div id="profile-forest-1080" className="flex items-center justify-center" style={{ width: 1080, height: 1080, background: colors.forest }}>
        <Mark fg="#F4F2EC" accent={colors.lime} size={560} />
      </div>
    ),
  },
  {
    label: 'profile-bone-1080 · Profile picture, light version, 1080×1080',
    node: (
      <div id="profile-bone-1080" className="flex items-center justify-center" style={{ width: 1080, height: 1080, background: '#F7F6F3' }}>
        <Mark fg={colors.ink} accent={colors.lichen} size={560} />
      </div>
    ),
  },
  { label: 'linkedin-cover-1128x191 · LinkedIn company page cover', node: <Banner id="linkedin-cover-1128x191" w={1128} h={191} scene="amber" seed={7} safe={{ w: 760, h: 160 }} centered mark={30} word={27} line={20} /> },
  { label: 'linkedin-cover-4200x700 · LinkedIn cover, high resolution', node: <Banner id="linkedin-cover-4200x700" w={4200} h={700} scene="amber" seed={7} safe={{ w: 2800, h: 580 }} centered mark={112} word={100} line={74} /> },
  { label: 'x-header-1500x500 · X (Twitter) header', node: <Banner id="x-header-1500x500" w={1500} h={500} scene="amber" seed={7} safe={{ w: 1100, h: 300 }} mark={64} word={56} line={42} /> },
  { label: 'facebook-cover-1640x624 · Facebook page cover (text in the top-centre, clear of the profile picture and the phone crop)', node: <Banner id="facebook-cover-1640x624" w={1640} h={624} scene="amber" seed={7} safe={{ w: 960, h: 250 }} top={50} centered mark={58} word={52} line={40} /> },
  { label: 'youtube-banner-2560x1440 · YouTube channel banner (text inside the 1546×423 safe area)', node: <Banner id="youtube-banner-2560x1440" w={2560} h={1440} scene="amber" seed={7} safe={{ w: 1546, h: 423 }} mark={84} word={74} line={56} /> },
  {
    label: 'launch-post-1080x1350 · First post (Instagram, LinkedIn, Facebook), 1080×1350',
    node: (
      <div id="launch-post-1080x1350" className="relative isolate flex flex-col justify-between overflow-hidden p-[88px] text-mist" style={{ width: 1080, height: 1350 }}>
        <Terrain scene="valley" seed={24} className="-z-20" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(14,24,16,.15), rgba(14,24,16,.75) 85%)' }} />
        <Lockup mark={64} word={56} />
        <div>
          <p className="font-display font-medium leading-[1.02] tracking-[-0.045em]" style={{ fontSize: 112 }}>Your new <span className="accent" style={{ color: colors.lime }}>growth team.</span></p>
          <p className="mt-8 max-w-[22ch] font-body text-mist/85" style={{ fontSize: 38, lineHeight: 1.3 }}>AI runs the engine. Senior marketers drive. One flat fee.</p>
          <p className="mt-10 font-mono uppercase tracking-[0.2em] text-lime" style={{ fontSize: 26 }}>hewn.life</p>
        </div>
      </div>
    ),
  },
  {
    label: 'launch-post-1080x1080 · First post, square, 1080×1080',
    node: (
      <div id="launch-post-1080x1080" className="relative isolate flex flex-col justify-between overflow-hidden p-[80px] text-mist" style={{ width: 1080, height: 1080, background: colors.forest }}>
        <Terrain scene="topo" seed={11} className="-z-20" />
        <Lockup mark={60} word={52} />
        <div>
          <p className="font-display font-medium leading-[1.02] tracking-[-0.045em]" style={{ fontSize: 104 }}>Zero to <span className="accent" style={{ color: colors.lime }}>$10M a year.</span></p>
          <p className="mt-7 max-w-[24ch] font-body text-mist/85" style={{ fontSize: 34, lineHeight: 1.3 }}>How our team built every growth function for a national telehealth brand.</p>
          <p className="mt-9 font-mono uppercase tracking-[0.2em] text-lime" style={{ fontSize: 24 }}>Case study · hewn.life</p>
        </div>
      </div>
    ),
  },
  ...launchSlides.map(({ label, node }) => ({ label, node })),
]

export default function SocialAssets() {
  return (
    <div className="bg-bone px-5 pb-24 pt-28">
      {/* The site header would sit over the exports, so it’s hidden on this page. */}
      <style>{'nav { display: none !important; }'}</style>
      <h1 className="font-display text-[40px] font-medium tracking-[-0.03em]">Social assets</h1>
      <div className="mt-8 flex flex-col gap-12">
        {assets.map(a => (
          <figure key={a.label}>
            <figcaption className="mb-3 font-mono text-[12px] uppercase tracking-[0.16em] text-ink/60">{a.label}</figcaption>
            <div className="overflow-auto">{a.node}</div>
          </figure>
        ))}
      </div>
    </div>
  )
}
