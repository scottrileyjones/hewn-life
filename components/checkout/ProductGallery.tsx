'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Terrain from '@/components/strata/Terrain'
import Photo from '@/components/strata/Photo'
import { Glyph, Mark } from '@/components/strata/Glyph'
import { rng } from '@/lib/strata'
import { kitListPrice, lookup } from '@/lib/addons'
import { platforms, type PlatformKey } from '@/lib/platforms'
import type { Chip, Head, Mock, Slide } from '@/lib/gallery'

/**
 * The checkout gallery: a swipeable set of slides that sells the package
 * (cover, the people it's for, what's included, the end result, how it starts).
 * Earth tones throughout: warm light grounds, copper and gold accents, dark
 * only where there's a photo or terrain under it. Sized in container units,
 * so one design scales from the phone to the 400px summary column.
 */

const E = {
  bone: '#F7F6F3',
  sand: '#E9E5DB',
  oat: '#E0DBD2',
  ink: '#0D0D0D',
  clay: '#685544',
  copper: '#8C4612',   // accent text on light grounds (passes on bone and sand)
  dawn: '#D9893F',
  gold: '#F2C58A',     // accent text on photos and terrain
  sage: '#9AA650',
  moss: '#3D4A3F',
  wood: '#3A2214',
}

/* ── Small parts ────────────────────────────────────────────── */

/** A platform's own logo in its brand colour; a name chip where we have no licensed file. */
export function Logo({ k, size = 16 }: { k: PlatformKey; size?: number }) {
  const p = platforms[k]
  if (!p.path) {
    return <span className="inline-flex shrink-0 items-center rounded-full border border-ink/15 bg-white px-[0.5em] font-body font-semibold leading-[1.6] text-ink" style={{ fontSize: Math.max(9, size * 0.62) }}>{p.name}</span>
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={p.name} className="shrink-0">
      <path d={p.path} fill={p.hex} />
    </svg>
  )
}

function Headline({ head, dark, size = 7.4 }: { head: Head; dark?: boolean; size?: number }) {
  return (
    <p className="font-display font-medium leading-[1.04] tracking-[-0.04em]" style={{ fontSize: `${size}cqw`, textWrap: 'balance', wordSpacing: '0.08em' } as React.CSSProperties}>
      {head.text}{head.accent && <>{' '}<span className="accent" style={{ color: dark ? E.gold : E.copper }}>{head.accent}</span></>}
    </p>
  )
}

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="absolute right-[3cqw] top-[3cqw] rounded-full bg-ink/[0.06] px-[2.2cqw] py-[0.8cqw] font-mono uppercase tracking-[0.16em] text-ink/55" style={{ fontSize: '2cqw' }}>
    {children}
  </span>
)

const bar = (w: string, c: string, h = '1.4cqw') => <span className="block rounded-full" style={{ width: w, height: h, background: c }} />

function ChipCard({ c }: { c: Chip }) {
  return (
    <div className="flex items-center gap-[2cqw] rounded-[2.6cqw] border border-white/40 bg-white/90 px-[2.4cqw] py-[1.6cqw] text-ink shadow-[0_1.4cqw_4cqw_rgba(20,12,6,.28)] backdrop-blur-md">
      {/* A platform without a licensed logo file is already named by the label */}
      {c.logo
        ? platforms[c.logo].path && <Logo k={c.logo} size={18} />
        : c.glyph && <Glyph name={c.glyph} fg={E.wood} accent={E.dawn} size={18} />}
      <span className="leading-tight">
        <span className="block font-body font-semibold" style={{ fontSize: '2.7cqw' }}>{c.label}</span>
        {c.sub && <span className="flex items-center gap-[0.8cqw] font-body text-ink/55" style={{ fontSize: '2.2cqw' }}><span className="h-[1.2cqw] w-[1.2cqw] rounded-full bg-[#5FA04A]" />{c.sub}</span>}
      </span>
    </div>
  )
}

/* ── Slides ─────────────────────────────────────────────────── */

function SlideView({ s, n, total }: { s: Slide; n: number; total: number }) {
  const dark = s.kind === 'cover' || s.kind === 'photo'
  const ground = s.kind === 'result' ? E.sand : E.bone
  return (
    <div className={`relative isolate flex h-full w-full flex-col overflow-hidden p-[6cqw] ${dark ? 'text-[#F7F1E8]' : 'text-ink'}`} style={{ background: dark ? E.wood : ground }}>
      {s.kind === 'cover' && <>
        <Terrain scene={s.scene} seed={s.seed} className="-z-20" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(20,12,6,.45), rgba(20,12,6,.05) 42%, rgba(20,12,6,.8))' }} />
      </>}
      {s.kind === 'photo' && <>
        <Photo name={s.photo} w={800} h={600} sizes="(min-width: 1024px) 400px, 100vw" className="-z-20" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(20,12,6,.35), rgba(20,12,6,0) 30%, rgba(20,12,6,0) 45%, rgba(20,12,6,.82))' }} />
      </>}

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-[1.6cqw]">
          <Mark fg={dark ? '#F7F1E8' : E.ink} accent={E.dawn} size={18} />
          <span className="font-display font-semibold leading-none" style={{ fontSize: '3.4cqw' }}>hewn<span className="accent" style={{ color: dark ? E.gold : E.copper }}>life</span></span>
        </span>
        <span className={`font-mono tracking-[0.18em] ${dark ? 'text-white/65' : 'text-ink/40'}`} style={{ fontSize: '2.4cqw' }}>{n} / {total}</span>
      </div>

      {s.kind === 'cover' && (
        <div className="mt-auto">
          <p className="font-mono uppercase tracking-[0.2em]" style={{ fontSize: '2.6cqw', color: E.gold }}>{s.eyebrow}</p>
          <div className="mt-[2cqw]"><Headline head={s.head} dark size={8.6} /></div>
          <p className="mt-[2.6cqw] font-body leading-snug text-white/80" style={{ fontSize: '3.4cqw' }}>{s.sub}</p>
        </div>
      )}

      {s.kind === 'photo' && (
        <>
          <div className="mt-[3cqw] flex flex-col items-end gap-[1.6cqw]">
            {s.chips.map(c => <ChipCard key={c.label} c={c} />)}
          </div>
          <div className="mt-auto max-w-[80%]"><Headline head={s.head} dark size={7.6} /></div>
        </>
      )}

      {s.kind === 'included' && (
        <>
          <div className="mt-[5cqw]"><Headline head={s.head} /></div>
          <ul className="mt-[4cqw] grid flex-1 grid-cols-2 content-start gap-[2.2cqw]">
            {s.items.map(it => (
              <li key={it.label} className="flex items-center gap-[2.2cqw] rounded-[3cqw] border border-ink/[0.07] bg-white px-[2.6cqw] py-[2.4cqw]">
                {it.logos?.length
                  ? <span className="flex shrink-0 items-center gap-[1cqw]">{it.logos.map(l => <Logo key={l} k={l} size={18} />)}</span>
                  : <Glyph name={it.glyph} fg={E.wood} accent={E.dawn} size={22} className="shrink-0" />}
                <span className="font-body font-medium leading-tight" style={{ fontSize: '2.9cqw' }}>{it.label}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {s.kind === 'result' && (
        <>
          {/* The mockup sits in a fixed box so it can never push over the headline */}
          <div className="relative mt-[3cqw] min-h-0 flex-1">
            <div className="absolute inset-0 flex items-center justify-center"><MockView mock={s.mock} /></div>
          </div>
          <div className="mt-[3cqw]">
            <Headline head={s.head} size={6.2} />
            <p className="mt-[1.4cqw] font-body leading-snug text-ink/65" style={{ fontSize: '3.1cqw' }}>{s.caption}</p>
          </div>
        </>
      )}

      {s.kind === 'steps' && (
        <>
          <div className="mt-[5cqw]"><Headline head={s.head} /></div>
          <ol className="mt-auto flex flex-col gap-[2.2cqw]">
            {s.steps.map((st, i) => {
              const last = i === s.steps.length - 1
              return (
                <li key={st.what} className={`flex items-center gap-[3.4cqw] rounded-[3.4cqw] border px-[3.6cqw] py-[3cqw] ${last ? 'border-[#E8C9A4] bg-[#F6E7D4]' : 'border-ink/[0.07] bg-white'}`}>
                  <span className="font-display font-semibold leading-none" style={{ fontSize: '6cqw', color: last ? E.copper : E.dawn }}>0{i + 1}</span>
                  <span>
                    <span className="block font-mono uppercase tracking-[0.16em] text-ink/45" style={{ fontSize: '2.3cqw' }}>{st.when}</span>
                    <span className="block font-body font-medium leading-snug" style={{ fontSize: '3.3cqw' }}>{st.what}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </>
      )}

      {s.kind === 'kit' && (
        <>
          <div className="mt-[3.4cqw]"><Headline head={s.head} size={6.4} /></div>
          <ul className="mt-auto flex flex-col gap-[1.4cqw]">
            {s.kit.includes.map(sku => {
              const a = lookup(sku)!
              return (
                <li key={sku} className="flex items-center justify-between gap-[3cqw] rounded-[3cqw] border border-ink/[0.07] bg-white px-[3.4cqw] py-[1.8cqw]">
                  <span className="font-body font-medium" style={{ fontSize: '3.2cqw' }}>{a.name}</span>
                  <span className="font-body tabular-nums text-ink/55" style={{ fontSize: '3cqw' }}>${a.fee.toLocaleString()}</span>
                </li>
              )
            })}
            <li className="flex items-center justify-between gap-[3cqw] rounded-[3cqw] border border-[#E8C9A4] bg-[#F6E7D4] px-[3.4cqw] py-[2.2cqw]">
              <span>
                <span className="block font-body font-medium" style={{ fontSize: '3.4cqw' }}>Kit price</span>
                <span className="mt-[0.8cqw] inline-block rounded-full px-[2cqw] py-[0.5cqw] font-body font-medium text-white" style={{ fontSize: '2.5cqw', background: E.copper }}>
                  You save ${(kitListPrice(s.kit) - s.kit.fee).toLocaleString()}
                </span>
              </span>
              <span className="text-right">
                <span className="block font-body tabular-nums text-ink/45 line-through" style={{ fontSize: '3cqw' }}>${kitListPrice(s.kit).toLocaleString()}</span>
                <span className="block font-display font-semibold leading-none tabular-nums" style={{ fontSize: '5.6cqw', color: E.copper }}>${s.kit.fee.toLocaleString()}</span>
              </span>
            </li>
          </ul>
        </>
      )}
    </div>
  )
}

/* ── Mockups of the end result (on the warm sand ground) ────── */

const shadow = 'shadow-[0_1.6cqw_5cqw_rgba(58,34,20,.18)]'

function Browser({ children, className = '', url = 'yourbusiness.com' }: { children: React.ReactNode; className?: string; url?: string }) {
  return (
    <div className={`overflow-hidden rounded-[2.4cqw] bg-white ${shadow} ${className}`}>
      <div className="flex items-center gap-[1cqw] border-b border-ink/[0.07] bg-[#F1EDE6] px-[2cqw] py-[1.4cqw]">
        {[0, 1, 2].map(i => <span key={i} className="h-[1.4cqw] w-[1.4cqw] rounded-full bg-ink/15" />)}
        <span className="ml-[1.4cqw] flex-1 truncate rounded-full bg-white px-[2cqw] py-[0.4cqw] font-body text-ink/50" style={{ fontSize: '2cqw' }}>{url}</span>
      </div>
      {children}
    </div>
  )
}

function SiteHero({ cta = 'Book a call' }: { cta?: string }) {
  return (
    <div className="flex flex-col gap-[1.4cqw] p-[3cqw]" style={{ background: `linear-gradient(160deg, ${E.dawn}, ${E.wood})` }}>
      <div className="flex items-center justify-between">
        <span className="h-[2.4cqw] w-[2.4cqw] rounded-[0.6cqw]" style={{ background: E.gold }} />
        <span className="flex gap-[1.2cqw]">{[6, 7, 5].map((w, i) => <span key={i}>{bar(`${w}cqw`, 'rgba(255,255,255,.4)', '1cqw')}</span>)}</span>
      </div>
      <div className="mt-[2cqw] flex flex-col gap-[1cqw]">{bar('70%', '#FFF6EA', '2.4cqw')}{bar('48%', '#FFF6EA', '2.4cqw')}</div>
      {bar('60%', 'rgba(255,255,255,.45)', '1.2cqw')}
      <span className="mt-[1cqw] self-start rounded-full bg-white px-[2.4cqw] py-[0.9cqw] font-body font-medium" style={{ fontSize: '2.1cqw', color: E.wood }}>{cta}</span>
    </div>
  )
}

function Phone({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`overflow-hidden rounded-[3.4cqw] border-[1cqw] border-[#1A1410] bg-white ${shadow} ${className}`}>{children}</div>
}

function Qr({ seed = 4 }: { seed?: number }) {
  const r = rng(seed)
  const N = 21
  const finder = (x: number, y: number) => {
    for (const [fx, fy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
      const dx = x - fx, dy = y - fy
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0
    }
    return -1
  }
  const cells = []
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const f = finder(x, y)
    if (f === 1 || (f === -1 && r() > 0.52)) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
  }
  return <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="h-full w-full" fill={E.ink} aria-hidden="true">{cells}</svg>
}

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) =>
  <div className={`rounded-[2.4cqw] border border-ink/[0.06] bg-white ${className}`}>{children}</div>

const Tracked = () => (
  <span className="mt-[0.6cqw] flex items-center gap-[0.8cqw] font-mono uppercase tracking-[0.14em]" style={{ fontSize: '1.7cqw', color: '#3F7A2E' }}>
    <svg viewBox="0 0 24 24" className="h-[2.2cqw] w-[2.2cqw]" fill="none" stroke="currentColor" strokeWidth={3.4}><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>Tracked
  </span>
)

const HIGHLIGHT = '!border-[#E8C9A4] !bg-[#F6E7D4]'

function MockView({ mock }: { mock: Mock }) {
  switch (mock) {
    case 'site':
      return (
        <div className="relative h-full w-full">
          <Browser className="absolute left-[2%] top-0 w-[70%]"><SiteHero /></Browser>
          <Phone className="absolute bottom-0 right-[4%] w-[22%]"><SiteHero cta="Call" /><div className="flex flex-col gap-[0.8cqw] p-[1.6cqw]">{bar('80%', 'rgba(13,13,13,.15)', '0.9cqw')}{bar('60%', 'rgba(13,13,13,.15)', '0.9cqw')}</div></Phone>
        </div>
      )
    case 'landing':
      return (
        <Browser className="w-[86%]" url="yourbusiness.com/offer">
          <div className="flex flex-col items-center gap-[1cqw] px-[4cqw] py-[2.2cqw] text-center">
            <span className="rounded-full bg-[#F6E7D4] px-[2cqw] py-[0.4cqw] font-mono uppercase tracking-[0.14em]" style={{ fontSize: '1.8cqw', color: E.copper }}>Limited offer</span>
            {bar('74%', E.ink, '2cqw')}{bar('52%', E.ink, '2cqw')}
            {bar('64%', 'rgba(13,13,13,.18)', '1.1cqw')}
            <div className="flex gap-[2.4cqw]">{[16, 14, 18].map((w, i) => <span key={i} className="flex items-center gap-[0.8cqw]"><span className="h-[1.6cqw] w-[1.6cqw] rounded-full" style={{ background: E.dawn }} />{bar(`${w * 0.5}cqw`, 'rgba(13,13,13,.25)', '0.9cqw')}</span>)}</div>
            <span className="mt-[0.6cqw] rounded-full px-[4cqw] py-[1.1cqw] font-body font-medium text-white" style={{ fontSize: '2.2cqw', background: E.wood }}>Claim your spot</span>
          </div>
        </Browser>
      )
    case 'brandsite':
      return (
        <div className="relative h-full w-full">
          <Card className={`absolute left-0 top-[6%] flex w-[40%] flex-col gap-[1.6cqw] p-[2.6cqw] ${shadow}`}>
            <span className="font-mono uppercase tracking-[0.14em] text-ink/45" style={{ fontSize: '1.7cqw' }}>Style guide</span>
            <span className="flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full font-display font-semibold text-white" style={{ fontSize: '4cqw', background: E.clay }}>Y</span>
            <span className="flex gap-[0.8cqw]">{[E.wood, E.clay, E.dawn, E.sage, E.oat].map(c => <span key={c} className="h-[4cqw] flex-1 rounded-[0.8cqw]" style={{ background: c }} />)}</span>
            <span className="font-display font-semibold leading-none text-ink" style={{ fontSize: '6cqw' }}>Aa <span className="accent font-normal" style={{ color: E.copper }}>Aa</span></span>
          </Card>
          <Browser className="absolute bottom-0 right-0 w-[64%]"><SiteHero /></Browser>
        </div>
      )
    case 'brandsheet':
      return (
        <div className="grid w-[92%] grid-cols-[1.1fr_1fr] gap-[2cqw]">
          <Card className="flex flex-col items-center justify-center gap-[1.4cqw] p-[3cqw]">
            <span className="flex h-[11cqw] w-[11cqw] items-center justify-center rounded-full font-display font-semibold text-white" style={{ fontSize: '5cqw', background: E.clay }}>Y</span>
            <span className="font-display font-semibold tracking-[-0.02em] text-ink" style={{ fontSize: '3.4cqw' }}>Your business</span>
          </Card>
          <div className="flex flex-col gap-[2cqw]">
            <Card className="grid grid-cols-6 gap-[0.8cqw] p-[2cqw]">{[E.wood, E.clay, E.dawn, E.sage, E.oat, E.bone].map(c => <span key={c} className="h-[6cqw] rounded-[0.8cqw] border border-ink/10" style={{ background: c }} />)}</Card>
            <Card className="p-[2cqw] text-ink"><span className="block font-display font-semibold leading-none" style={{ fontSize: '6.4cqw' }}>Aa</span><span className="mt-[1cqw] block font-mono uppercase tracking-[0.14em] text-ink/45" style={{ fontSize: '1.7cqw' }}>Headings · body · accent</span></Card>
          </div>
        </div>
      )
    case 'funnel': {
      const steps = ['Ad', 'Landing page', 'Follow-up', 'Booked'] as const
      return (
        <div className="flex w-full flex-col gap-[2.6cqw]">
          <div className="flex items-center justify-between">
            {steps.map((t, i) => (
              <div key={t} className="flex flex-1 items-center">
                <Card className={`flex flex-1 flex-col items-center gap-[1.2cqw] px-[1cqw] py-[2.2cqw] ${i === 3 ? HIGHLIGHT : ''}`}>
                  {i === 0
                    ? <span className="flex gap-[0.8cqw]"><Logo k="googleAds" size={16} /><Logo k="meta" size={16} /></span>
                    : <Glyph name={(['media', 'creative', 'lifecycle', 'data'] as const)[i]} fg={E.wood} accent={E.dawn} size={18} />}
                  <span className="text-center font-body font-medium leading-tight" style={{ fontSize: '2.3cqw' }}>{t}</span>
                </Card>
                {i < 3 && <span className="px-[0.6cqw]" style={{ fontSize: '3cqw', color: E.dawn }}>→</span>}
              </div>
            ))}
          </div>
          <Card className="grid grid-cols-4 gap-[1.2cqw] p-[2cqw]">
            {['New', 'Contacted', 'Booked', 'Won'].map((col, ci) => (
              <div key={col} className="flex flex-col gap-[0.9cqw]">
                <span className="font-mono uppercase tracking-[0.14em] text-ink/45" style={{ fontSize: '1.7cqw' }}>{col}</span>
                {Array.from({ length: 3 - Math.floor(ci / 2) }, (_, k) => <span key={k} className="h-[3.2cqw] rounded-[0.8cqw]" style={{ background: ci === 3 ? '#F6E7D4' : E.bone, border: `1px solid ${ci === 3 ? '#E8C9A4' : 'rgba(13,13,13,.06)'}` }} />)}
              </div>
            ))}
          </Card>
        </div>
      )
    }
    case 'dashboard': {
      const r = rng(11)
      const pts = (base: number, amp: number) => Array.from({ length: 13 }, (_, i) => [i * (300 / 12), base - amp * (0.4 + r() * 0.6) - i * 2.2] as const)
      const layers = [[150, 30, E.sage], [150, 55, E.dawn], [150, 80, E.clay]] as const
      return (
        <Card className="relative w-full px-[3cqw] py-[2.4cqw]">
          <Tag>Sample data</Tag>
          <span className="font-mono uppercase tracking-[0.16em] text-ink/45" style={{ fontSize: '1.9cqw' }}>Growth dashboard</span>
          <svg viewBox="0 0 300 150" preserveAspectRatio="none" className="mt-[1.2cqw] block h-[13cqw] w-full" aria-hidden="true">
            {[0, 1, 2, 3].map(g => <line key={g} x1="0" x2="300" y1={150 - g * 40} y2={150 - g * 40} stroke="rgba(13,13,13,.06)" />)}
            {layers.slice().reverse().map(([b, a, c], i) => {
              const p = pts(b, a)
              return <path key={i} d={`M0,150 ${p.map(([x, y]) => `L${x},${y}`).join(' ')} L300,150 Z`} fill={c} fillOpacity={0.9 - i * 0.12} />
            })}
          </svg>
          <div className="mt-[1.6cqw] grid grid-cols-3 gap-[1.2cqw]">
            {([['Search ads', 'Scale', '#3F7A2E'], ['Retargeting', 'Watch', '#9A6A00'], ['Display', 'Cut or fix', '#B23B1E']] as const).map(([n, v, c]) => (
              <div key={n} className="rounded-[1.6cqw] bg-[#F4F1EB] p-[1.6cqw]">
                <span className="block font-body text-ink/60" style={{ fontSize: '2cqw' }}>{n}</span>
                <span className="mt-[0.6cqw] flex items-center gap-[0.8cqw] font-body font-medium" style={{ fontSize: '2.3cqw', color: c }}><span className="h-[1.4cqw] w-[1.4cqw] rounded-full" style={{ background: c }} />{v}</span>
              </div>
            ))}
          </div>
        </Card>
      )
    }
    case 'profile':
      return (
        <div className="relative h-full w-full overflow-hidden rounded-[2.6cqw]" style={{ background: '#ECE6D8' }}>
          <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M-10,140 C60,120 120,160 310,90" stroke="#fff" strokeWidth="9" fill="none" />
            <path d="M80,-10 C90,60 70,130 110,210" stroke="#fff" strokeWidth="6" fill="none" />
            <path d="M200,-10 L230,210" stroke="#fff" strokeWidth="5" fill="none" />
            <rect x="140" y="20" width="44" height="30" rx="4" fill="#D5DCC0" />
          </svg>
          <div className="absolute left-[44%] top-[8%]"><Logo k="googleMaps" size={30} /></div>
          <div className={`absolute bottom-[4%] left-[4%] right-[4%] rounded-[2.2cqw] bg-white p-[2.6cqw] text-ink ${shadow}`}>
            <span className="block font-display font-semibold" style={{ fontSize: '3.6cqw' }}>Your business</span>
            <span className="block font-body text-ink/55" style={{ fontSize: '2.2cqw' }}>Your service · Your town</span>
            <div className="mt-[1.8cqw] grid grid-cols-4 gap-[1cqw]">
              {['Call', 'Directions', 'Website', 'Book'].map((b, i) => (
                <span key={b} className={`rounded-full py-[0.9cqw] text-center font-body font-medium ${i === 0 ? 'text-white' : 'border border-ink/15 text-ink/80'}`} style={{ fontSize: '2cqw', background: i === 0 ? '#1A73E8' : undefined }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      )
    case 'audit': {
      const rows: [PlatformKey, number, number][] = [['google', 0.42, 0.78], ['googleMaps', 0.55, 0.7], ['chatgpt', 0.2, 0.6], ['gemini', 0.3, 0.52]]
      return (
        <Card className="relative w-full p-[3cqw] text-ink">
          <Tag>Sample data</Tag>
          <span className="font-mono uppercase tracking-[0.16em] text-ink/45" style={{ fontSize: '1.9cqw' }}>Visibility vs. competitor</span>
          <div className="mt-[2cqw] flex flex-col gap-[1.5cqw]">
            {rows.map(([k, you, them]) => (
              <div key={k} className="grid grid-cols-[32%_1fr] items-center gap-[2cqw]">
                <span className="flex items-center gap-[1.2cqw] font-body font-medium" style={{ fontSize: '2.3cqw' }}>{platforms[k].path && <Logo k={k} size={13} />}{platforms[k].name}</span>
                <div className="flex flex-col gap-[0.6cqw]">
                  <span className="h-[1.5cqw] rounded-full" style={{ width: `${you * 100}%`, background: E.dawn }} />
                  <span className="h-[1.5cqw] rounded-full bg-ink/15" style={{ width: `${them * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[2cqw] flex gap-[3cqw] font-body text-ink/55" style={{ fontSize: '2cqw' }}>
            <span className="flex items-center gap-[0.8cqw]"><span className="h-[1.4cqw] w-[1.4cqw] rounded-full" style={{ background: E.dawn }} />You</span>
            <span className="flex items-center gap-[0.8cqw]"><span className="h-[1.4cqw] w-[1.4cqw] rounded-full bg-ink/15" />Top competitor</span>
          </div>
        </Card>
      )
    }
    case 'reviews':
      return (
        <div className="flex w-full items-center justify-center gap-[4cqw]">
          <Phone className="w-[42%]">
            <div className="flex flex-col gap-[1.4cqw] bg-[#F4F1EB] p-[2.4cqw]" style={{ minHeight: '32cqw' }}>
              <span className="text-center font-body text-ink/45" style={{ fontSize: '1.8cqw' }}>Text message · Today</span>
              <span className="max-w-[90%] rounded-[2cqw] rounded-bl-[0.4cqw] bg-white p-[2cqw] font-body leading-snug text-ink" style={{ fontSize: '2.2cqw' }}>Thanks for choosing us today. Would you leave a quick review? It really helps.</span>
              <span className="flex items-center gap-[1cqw] self-start rounded-full bg-white px-[2.2cqw] py-[1cqw] font-body font-medium text-ink" style={{ fontSize: '2.1cqw' }}><Logo k="google" size={12} />Leave a review</span>
            </div>
          </Phone>
          <Card className={`flex w-[34%] flex-col items-center gap-[1.4cqw] p-[2.6cqw] text-ink ${shadow}`}>
            <span className="flex items-center gap-[1cqw] font-display font-semibold leading-tight" style={{ fontSize: '2.6cqw' }}><Logo k="google" size={13} />Review us</span>
            <div className="aspect-square w-full"><Qr /></div>
            <span className="font-mono uppercase tracking-[0.14em] text-ink/45" style={{ fontSize: '1.6cqw' }}>Counter card</span>
          </Card>
        </div>
      )
    case 'tracking': {
      const steps: [string, string][] = [['Click', 'Google · Meta'], ['Lead', 'Form or call'], ['Customer', 'Booked job']]
      return (
        <div className="flex w-full flex-col gap-[2.6cqw]">
          <div className="flex items-stretch gap-[1.4cqw]">
            {steps.map(([t, d], i) => (
              <div key={t} className="flex flex-1 items-center gap-[1.4cqw]">
                <Card className={`flex flex-1 flex-col gap-[0.8cqw] p-[2.4cqw] ${i === 2 ? HIGHLIGHT : ''}`}>
                  {i === 0 && <span className="flex gap-[0.8cqw]"><Logo k="googleAds" size={14} /><Logo k="meta" size={14} /></span>}
                  <span className="font-display font-semibold" style={{ fontSize: '3.6cqw' }}>{t}</span>
                  <span className="font-body text-ink/55" style={{ fontSize: '2.1cqw' }}>{d}</span>
                  <Tracked />
                </Card>
                {i < 2 && <span style={{ fontSize: '3cqw', color: E.dawn }}>→</span>}
              </div>
            ))}
          </div>
          <Card className="flex items-center gap-[2cqw] px-[2.6cqw] py-[1.8cqw]">
            <span className="h-[1.6cqw] w-[1.6cqw] rounded-full bg-[#B23B1E]" />
            <span className="font-body text-ink/75" style={{ fontSize: '2.3cqw' }}>Wasted spend flagged and paused</span>
          </Card>
        </div>
      )
    }
    case 'ads': {
      const tiles: { ar: string; bg: string; fmt: string; k: PlatformKey }[] = [
        { ar: '1/1', bg: E.dawn, fmt: '1:1', k: 'instagram' }, { ar: '4/5', bg: E.sage, fmt: '4:5', k: 'facebook' }, { ar: '9/16', bg: E.wood, fmt: '9:16', k: 'tiktok' }, { ar: '1/1', bg: E.clay, fmt: '1:1', k: 'meta' },
        { ar: '9/16', bg: E.clay, fmt: '9:16', k: 'instagram' }, { ar: '1/1', bg: E.wood, fmt: '1:1', k: 'facebook' }, { ar: '4/5', bg: E.dawn, fmt: '4:5', k: 'instagram' }, { ar: '1.91/1', bg: E.sage, fmt: '1.91:1', k: 'googleAds' },
      ]
      return (
        <div className="flex w-full flex-col items-center gap-[1.6cqw]">
          {[tiles.slice(0, 4), tiles.slice(4)].map((row, ri) => (
            <div key={ri} className="flex items-end justify-center gap-[1.6cqw]">
              {row.map((t, i) => (
                <div key={i} className={`relative flex flex-col justify-between overflow-hidden rounded-[1.6cqw] p-[1.2cqw] ${shadow}`} style={{ aspectRatio: t.ar, background: t.bg, height: '13cqw' }}>
                  <span className="flex h-[3.4cqw] w-[3.4cqw] items-center justify-center rounded-full bg-white"><Logo k={t.k} size={10} /></span>
                  <div className="flex flex-col gap-[0.6cqw]">{bar('80%', 'rgba(255,255,255,.9)', '1cqw')}{bar('55%', 'rgba(255,255,255,.55)', '0.8cqw')}</div>
                  <span className="absolute right-[1cqw] top-[1cqw] font-mono text-white/75" style={{ fontSize: '1.5cqw' }}>{t.fmt}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )
    }
    case 'email':
      return (
        <div className="relative flex w-full flex-col gap-[0.8cqw]">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-[2cqw]">
              <span className="flex h-[3.8cqw] w-[3.8cqw] shrink-0 items-center justify-center rounded-full font-display font-semibold" style={{ fontSize: '2.2cqw', background: i === 5 ? E.copper : 'transparent', color: i === 5 ? '#fff' : E.wood, border: i === 5 ? 'none' : `1px solid ${E.clay}55` }}>{i + 1}</span>
              <Card className="flex flex-1 items-center gap-[2cqw] px-[2.2cqw] py-[0.8cqw]">
                <Logo k="gmail" size={12} />
                <span className="flex flex-1 flex-col gap-[0.6cqw]">{bar(`${[62, 48, 70, 55, 66, 44][i]}%`, E.ink, '1.1cqw')}{bar(`${[80, 72, 60, 84, 70, 76][i]}%`, 'rgba(13,13,13,.15)', '0.8cqw')}</span>
              </Card>
            </div>
          ))}
        </div>
      )
    case 'blog':
      return (
        <div className="grid w-full grid-cols-2 gap-[1.6cqw]">
          {[E.dawn, E.sage, E.clay, E.oat].map((c, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-[5cqw]" style={{ background: `linear-gradient(160deg, ${c}, ${E.wood})` }} />
              <div className="flex flex-col gap-[0.7cqw] p-[1.4cqw]">
                {bar('86%', E.ink, '1.3cqw')}{bar('60%', E.ink, '1.3cqw')}
                <span className="mt-[0.4cqw] font-mono uppercase tracking-[0.12em] text-ink/45" style={{ fontSize: '1.6cqw' }}>1,200–1,500 words</span>
              </div>
            </Card>
          ))}
        </div>
      )
    case 'clips':
      return (
        <div className="flex w-full flex-col items-center gap-[2cqw]">
          <div className="grid w-full grid-cols-10 gap-[1cqw]">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="relative flex aspect-[9/16] flex-col justify-end overflow-hidden rounded-[1.4cqw] p-[1cqw]" style={{ background: `linear-gradient(170deg, ${[E.dawn, E.sage, E.clay, '#B07A48', E.moss][i % 5]}, #1A1410)` }}>
                <svg viewBox="0 0 24 24" className="absolute left-1/2 top-[38%] h-[2.6cqw] w-[2.6cqw] -translate-x-1/2" fill="rgba(255,255,255,.9)"><path d="M8 5v14l11-7z" /></svg>
                <span className="rounded-[0.6cqw] bg-black/55 px-[0.8cqw] py-[0.5cqw]">{bar('90%', '#fff', '0.7cqw')}</span>
              </div>
            ))}
          </div>
          <Card className="flex items-center gap-[3cqw] px-[3cqw] py-[1.4cqw]">
            {([['instagram', 'Reels'], ['tiktok', 'TikTok'], ['youtubeShorts', 'Shorts']] as const).map(([k, t]) => <span key={k} className="flex items-center gap-[1cqw] font-body font-medium" style={{ fontSize: '2.2cqw' }}><Logo k={k} size={14} />{t}</span>)}
          </Card>
        </div>
      )
    case 'copy':
      return (
        <Card className="w-[90%] overflow-hidden text-ink">
          <div className="flex gap-[0.6cqw] border-b border-ink/[0.07] bg-[#F1EDE6] px-[2cqw] pt-[1.4cqw]">
            {['Home', 'About', 'Services', 'Work', 'Contact'].map((t, i) => (
              <span key={t} className={`rounded-t-[1cqw] px-[1.6cqw] py-[0.9cqw] font-body ${i === 0 ? 'bg-white font-medium text-ink' : 'text-ink/50'}`} style={{ fontSize: '2cqw' }}>{t}</span>
            ))}
          </div>
          <div className="flex flex-col gap-[1.2cqw] p-[3cqw]">
            <span className="font-mono uppercase tracking-[0.14em]" style={{ fontSize: '1.7cqw', color: E.copper }}>Headline</span>
            {bar('78%', E.ink, '2.2cqw')}{bar('50%', E.ink, '2.2cqw')}
            <span className="mt-[0.6cqw] font-mono uppercase tracking-[0.14em]" style={{ fontSize: '1.7cqw', color: E.copper }}>Why us</span>
            {bar('92%', 'rgba(13,13,13,.15)', '1cqw')}{bar('84%', 'rgba(13,13,13,.15)', '1cqw')}{bar('66%', 'rgba(13,13,13,.15)', '1cqw')}
            <span className="mt-[0.6cqw] self-start rounded-full px-[2.4cqw] py-[0.9cqw] font-body font-medium text-white" style={{ fontSize: '2cqw', background: E.wood }}>Call to action</span>
          </div>
        </Card>
      )
  }
}

/* ── The carousel ───────────────────────────────────────────── */

export default function ProductGallery({ slides, label }: { slides: Slide[]; label: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(0)

  const go = useCallback((i: number) => {
    const el = track.current
    if (!el) return
    const n = Math.max(0, Math.min(slides.length - 1, i))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: n * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
  }, [slides.length])

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => setAt(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  if (!slides.length) return null

  return (
    <section className="group relative" aria-roledescription="carousel" aria-label={`${label}: what you get`}>
      <div
        ref={track}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1) } if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1) } }}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dawn [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <div key={i} className="aspect-[4/3] w-full shrink-0 snap-center snap-always" style={{ containerType: 'inline-size' }}
            role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`} aria-hidden={i !== at}>
            <SlideView s={s} n={i + 1} total={slides.length} />
          </div>
        ))}
      </div>

      {slides.length > 1 && <>
        {(['prev', 'next'] as const).map(dir => {
          const disabled = dir === 'prev' ? at === 0 : at === slides.length - 1
          return (
            <button key={dir} type="button" onClick={() => go(at + (dir === 'prev' ? -1 : 1))} disabled={disabled}
              aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
              className={`absolute top-[37.5%] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-white disabled:opacity-0 sm:flex sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 ${dir === 'prev' ? 'left-3' : 'right-3'}`}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}><path strokeLinecap="round" strokeLinejoin="round" d={dir === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} /></svg>
            </button>
          )
        })}
        <div className="flex items-center justify-center gap-1.5 border-b border-black/[0.06] bg-white py-3">
          {slides.map((_, i) => (
            <button key={i} type="button" onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === at}
              className="flex h-6 items-center justify-center px-0.5">
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === at ? 'w-6 bg-[#8C4612]' : 'w-1.5 bg-ink/20'}`} />
            </button>
          ))}
        </div>
      </>}
    </section>
  )
}
