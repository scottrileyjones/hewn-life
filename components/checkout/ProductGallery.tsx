'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Terrain from '@/components/strata/Terrain'
import { Glyph, Mark } from '@/components/strata/Glyph'
import { colors, rng, type GlyphKey } from '@/lib/strata'
import { kitListPrice, lookup } from '@/lib/addons'
import type { Head, Mock, Slide } from '@/lib/gallery'

/**
 * The checkout gallery: a swipeable set of slides that sells the package
 * (cover, what's included, the end result, how it starts). Slides are drawn
 * live in the Strata language and sized in container units, so one design
 * scales from the phone to the 400px summary column.
 */

const C = colors

function Headline({ head, dark, size = 7.4 }: { head: Head; dark?: boolean; size?: number }) {
  return (
    <p className="font-display font-medium leading-[1.04] tracking-[-0.04em]" style={{ fontSize: `${size}cqw`, textWrap: 'balance', wordSpacing: '0.08em' } as React.CSSProperties}>
      {head.text}{head.accent && <>{' '}<span className="accent" style={{ color: dark ? C.lime : C.forest }}>{head.accent}</span></>}
    </p>
  )
}

const Tag = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <span className={`absolute right-[4cqw] top-[4cqw] rounded-full px-[2.4cqw] py-[0.9cqw] font-mono uppercase tracking-[0.16em] ${dark ? 'bg-white/10 text-mist/75' : 'bg-ink/[0.06] text-ink/55'}`} style={{ fontSize: '2.2cqw' }}>
    {children}
  </span>
)

/* ── Slides ─────────────────────────────────────────────────── */

function SlideView({ s, n, total }: { s: Slide; n: number; total: number }) {
  const dark = s.kind === 'cover' || s.kind === 'result'
  return (
    <div className={`relative isolate flex h-full w-full flex-col overflow-hidden p-[6cqw] ${dark ? 'text-mist' : 'text-ink'}`}
      style={{ background: s.kind === 'result' ? C.forest : s.kind === 'cover' ? C.forest : C.bone }}>
      {s.kind === 'cover' && <>
        <Terrain scene={s.scene} seed={s.seed} className="-z-20" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,.5), rgba(10,8,6,.05) 42%, rgba(10,8,6,.82))' }} />
      </>}

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-[1.6cqw]">
          <Mark fg={dark ? C.mist : C.ink} accent={C.lichen} size={18} />
          <span className="font-display font-semibold leading-none" style={{ fontSize: '3.4cqw' }}>hewn<span className="accent" style={{ color: dark ? C.lime : C.forest }}>life</span></span>
        </span>
        {s.kind !== 'result' && <span className={`font-mono tracking-[0.18em] ${dark ? 'text-mist/60' : 'text-ink/40'}`} style={{ fontSize: '2.4cqw' }}>{n} / {total}</span>}
      </div>

      {s.kind === 'cover' && (
        <div className="mt-auto">
          <p className="font-mono uppercase tracking-[0.2em] text-lime" style={{ fontSize: '2.6cqw' }}>{s.eyebrow}</p>
          <div className="mt-[2cqw]"><Headline head={s.head} dark size={8.6} /></div>
          <p className="mt-[2.6cqw] max-w-[60ch] font-body leading-snug text-mist/80" style={{ fontSize: '3.4cqw' }}>{s.sub}</p>
        </div>
      )}

      {s.kind === 'included' && (
        <>
          <div className="mt-[5cqw]"><Headline head={s.head} /></div>
          <ul className="mt-[4cqw] grid flex-1 grid-cols-2 content-start gap-[2.2cqw]">
            {s.items.map(it => (
              <li key={it.label} className="flex items-center gap-[2.2cqw] rounded-[3cqw] border border-ink/[0.07] bg-white px-[2.6cqw] py-[2.4cqw]">
                <Glyph name={it.glyph} fg={C.forest} accent={C.lichen} size={22} className="shrink-0" />
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
            <Headline head={s.head} dark size={6.2} />
            <p className="mt-[1.4cqw] font-body leading-snug text-mist/75" style={{ fontSize: '3.1cqw' }}>{s.caption}</p>
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
                <li key={st.what} className={`flex items-center gap-[3.4cqw] rounded-[3.4cqw] px-[3.6cqw] py-[3cqw] ${last ? 'bg-forest text-mist' : 'border border-ink/[0.07] bg-white'}`}>
                  <span className={`font-display font-semibold leading-none ${last ? 'text-lime' : 'text-dawn'}`} style={{ fontSize: '6cqw' }}>0{i + 1}</span>
                  <span>
                    <span className={`block font-mono uppercase tracking-[0.16em] ${last ? 'text-mist/60' : 'text-ink/45'}`} style={{ fontSize: '2.3cqw' }}>{st.when}</span>
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
            <li className="flex items-center justify-between gap-[3cqw] rounded-[3cqw] bg-forest px-[3.4cqw] py-[2.2cqw] text-mist">
              <span>
                <span className="block font-body font-medium" style={{ fontSize: '3.4cqw' }}>Kit price</span>
                <span className="mt-[0.8cqw] inline-block rounded-full bg-lime px-[2cqw] py-[0.5cqw] font-body font-medium text-forest" style={{ fontSize: '2.5cqw' }}>
                  You save ${(kitListPrice(s.kit) - s.kit.fee).toLocaleString()}
                </span>
              </span>
              <span className="text-right">
                <span className="block font-body tabular-nums text-mist/50 line-through" style={{ fontSize: '3cqw' }}>${kitListPrice(s.kit).toLocaleString()}</span>
                <span className="block font-display font-semibold leading-none tabular-nums text-lime" style={{ fontSize: '5.6cqw' }}>${s.kit.fee.toLocaleString()}</span>
              </span>
            </li>
          </ul>
        </>
      )}
    </div>
  )
}

/* ── Mockups of the end result ──────────────────────────────── */

const bar = (w: string, c: string, h = '1.4cqw') => <span className="block rounded-full" style={{ width: w, height: h, background: c }} />

function Browser({ children, className = '', url = 'yourbusiness.com' }: { children: React.ReactNode; className?: string; url?: string }) {
  return (
    <div className={`overflow-hidden rounded-[2.4cqw] bg-white shadow-[0_2cqw_6cqw_rgba(0,0,0,.35)] ${className}`}>
      <div className="flex items-center gap-[1cqw] border-b border-ink/[0.07] bg-[#F1EFEA] px-[2cqw] py-[1.4cqw]">
        {[0, 1, 2].map(i => <span key={i} className="h-[1.4cqw] w-[1.4cqw] rounded-full bg-ink/15" />)}
        <span className="ml-[1.4cqw] flex-1 truncate rounded-full bg-white px-[2cqw] py-[0.4cqw] font-body text-ink/50" style={{ fontSize: '2cqw' }}>{url}</span>
      </div>
      {children}
    </div>
  )
}

function SiteHero({ cta = 'Book a call' }: { cta?: string }) {
  return (
    <div className="flex flex-col gap-[1.4cqw] p-[3cqw]" style={{ background: `linear-gradient(160deg, ${C.forest2}, ${C.forest})` }}>
      <div className="flex items-center justify-between">
        <span className="h-[2.4cqw] w-[2.4cqw] rounded-[0.6cqw] bg-lime" />
        <span className="flex gap-[1.2cqw]">{[6, 7, 5].map((w, i) => <span key={i}>{bar(`${w}cqw`, 'rgba(244,242,236,.35)', '1cqw')}</span>)}</span>
      </div>
      <div className="mt-[2cqw] flex flex-col gap-[1cqw]">{bar('70%', C.mist, '2.4cqw')}{bar('48%', C.mist, '2.4cqw')}</div>
      {bar('60%', 'rgba(244,242,236,.4)', '1.2cqw')}
      <span className="mt-[1cqw] self-start rounded-full bg-lime px-[2.4cqw] py-[0.9cqw] font-body font-medium text-forest" style={{ fontSize: '2.1cqw' }}>{cta}</span>
    </div>
  )
}

function Phone({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[3.4cqw] border-[1cqw] border-[#111] bg-white shadow-[0_2cqw_6cqw_rgba(0,0,0,.4)] ${className}`}>{children}</div>
  )
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
  return <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="h-full w-full" fill={C.ink} aria-hidden="true">{cells}</svg>
}

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
            <span className="rounded-full bg-lime/60 px-[2cqw] py-[0.4cqw] font-mono uppercase tracking-[0.14em] text-forest" style={{ fontSize: '1.8cqw' }}>Limited offer</span>
            {bar('74%', C.ink, '2cqw')}{bar('52%', C.ink, '2cqw')}
            {bar('64%', 'rgba(13,13,13,.18)', '1.1cqw')}
            <div className="flex gap-[2.4cqw]">{[16, 14, 18].map((w, i) => <span key={i} className="flex items-center gap-[0.8cqw]"><svg viewBox="0 0 100 100" className="h-[2.2cqw] w-[2.2cqw]"><rect x="14" y="30" width="16" height="56" fill={C.forest} /><polygon points="30,62 86,34 86,48 30,76" fill={C.lichen} /></svg>{bar(`${w * 0.5}cqw`, 'rgba(13,13,13,.25)', '0.9cqw')}</span>)}</div>
            <span className="mt-[0.6cqw] rounded-full bg-forest px-[4cqw] py-[1.1cqw] font-body font-medium text-mist" style={{ fontSize: '2.2cqw' }}>Claim your spot</span>
          </div>
        </Browser>
      )
    case 'brandsite':
      return (
        <div className="relative h-full w-full">
          <div className="absolute left-0 top-[6%] flex w-[40%] flex-col gap-[1.6cqw] rounded-[2.4cqw] bg-white p-[2.6cqw] shadow-[0_2cqw_6cqw_rgba(0,0,0,.35)]">
            <span className="font-mono uppercase tracking-[0.14em] text-ink/45" style={{ fontSize: '1.7cqw' }}>Style guide</span>
            <span className="flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full bg-forest font-display font-semibold text-lime" style={{ fontSize: '4cqw' }}>Y</span>
            <span className="flex gap-[0.8cqw]">{[C.forest, C.lichen, C.dawn, C.sand, C.ink].map(c => <span key={c} className="h-[4cqw] flex-1 rounded-[0.8cqw]" style={{ background: c }} />)}</span>
            <span className="font-display font-semibold leading-none text-ink" style={{ fontSize: '6cqw' }}>Aa <span className="accent font-normal" style={{ color: C.forest }}>Aa</span></span>
          </div>
          <Browser className="absolute bottom-0 right-0 w-[64%]"><SiteHero /></Browser>
        </div>
      )
    case 'brandsheet':
      return (
        <div className="grid w-[92%] grid-cols-[1.1fr_1fr] gap-[2cqw]">
          <div className="flex flex-col items-center justify-center gap-[1.4cqw] rounded-[2.4cqw] bg-white p-[3cqw]">
            <span className="flex h-[11cqw] w-[11cqw] items-center justify-center rounded-full bg-forest font-display font-semibold text-lime" style={{ fontSize: '5cqw' }}>Y</span>
            <span className="font-display font-semibold tracking-[-0.02em] text-ink" style={{ fontSize: '3.4cqw' }}>Your business</span>
          </div>
          <div className="flex flex-col gap-[2cqw]">
            <div className="grid grid-cols-6 gap-[0.8cqw] rounded-[2.4cqw] bg-white p-[2cqw]">{[C.forest, C.lichen, C.dawn, C.sand, C.ink, C.mist].map(c => <span key={c} className="h-[6cqw] rounded-[0.8cqw] border border-ink/10" style={{ background: c }} />)}</div>
            <div className="rounded-[2.4cqw] bg-white p-[2cqw] text-ink"><span className="block font-display font-semibold leading-none" style={{ fontSize: '6.4cqw' }}>Aa</span><span className="mt-[1cqw] block font-mono uppercase tracking-[0.14em] text-ink/45" style={{ fontSize: '1.7cqw' }}>Headings · body · accent</span></div>
          </div>
        </div>
      )
    case 'funnel': {
      const steps: [GlyphKey, string][] = [['media', 'Ad'], ['creative', 'Landing page'], ['lifecycle', 'Follow-up'], ['data', 'Booked']]
      return (
        <div className="flex w-full flex-col gap-[3cqw]">
          <div className="flex items-center justify-between">
            {steps.map(([g, t], i) => (
              <div key={t} className="flex flex-1 items-center">
                <div className={`flex flex-1 flex-col items-center gap-[1.2cqw] rounded-[2.4cqw] px-[1cqw] py-[2.4cqw] ${i === 3 ? 'bg-lime text-forest' : 'border border-white/15 bg-black/20 text-mist'}`}>
                  <Glyph name={g} fg={i === 3 ? C.forest : C.mist} accent={i === 3 ? C.forest : C.lime} size={22} />
                  <span className="text-center font-body font-medium leading-tight" style={{ fontSize: '2.3cqw' }}>{t}</span>
                </div>
                {i < 3 && <span className="px-[0.6cqw] text-lime" style={{ fontSize: '3cqw' }}>→</span>}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-[1.2cqw] rounded-[2.4cqw] bg-white/[0.06] p-[2cqw]">
            {['New', 'Contacted', 'Booked', 'Won'].map((col, ci) => (
              <div key={col} className="flex flex-col gap-[0.9cqw]">
                <span className="font-mono uppercase tracking-[0.14em] text-mist/55" style={{ fontSize: '1.7cqw' }}>{col}</span>
                {Array.from({ length: 3 - Math.floor(ci / 2) }, (_, k) => <span key={k} className="h-[3.4cqw] rounded-[0.8cqw]" style={{ background: ci === 3 ? C.lime : 'rgba(244,242,236,.14)' }} />)}
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'dashboard': {
      const r = rng(11)
      const pts = (base: number, amp: number) => Array.from({ length: 13 }, (_, i) => [i * (300 / 12), base - amp * (0.4 + r() * 0.6) - i * 2.2] as const)
      const layers = [[150, 30, C.lime], [150, 55, '#8FCB5F'], [150, 80, C.dawn]] as const
      return (
        <div className="relative w-full rounded-[2.6cqw] border border-white/10 bg-[#111814] px-[3cqw] py-[2.4cqw]">
          <Tag dark>Sample data</Tag>
          <span className="font-mono uppercase tracking-[0.16em] text-mist/55" style={{ fontSize: '1.9cqw' }}>Growth dashboard</span>
          <svg viewBox="0 0 300 150" preserveAspectRatio="none" className="mt-[1.2cqw] block h-[13cqw] w-full" aria-hidden="true">
            {[0, 1, 2, 3].map(g => <line key={g} x1="0" x2="300" y1={150 - g * 40} y2={150 - g * 40} stroke="rgba(244,242,236,.07)" />)}
            {layers.slice().reverse().map(([b, a, c], i) => {
              const p = pts(b, a)
              return <path key={i} d={`M0,150 ${p.map(([x, y]) => `L${x},${y}`).join(' ')} L300,150 Z`} fill={c} fillOpacity={0.85 - i * 0.12} />
            })}
          </svg>
          <div className="mt-[1.6cqw] grid grid-cols-3 gap-[1.2cqw]">
            {([['Search ads', 'Scale', '#8FCB5F'], ['Retargeting', 'Watch', '#E0B84C'], ['Display', 'Cut or fix', '#E8866B']] as const).map(([n, v, c]) => (
              <div key={n} className="rounded-[1.6cqw] bg-white/[0.05] p-[1.6cqw]">
                <span className="block font-body text-mist/70" style={{ fontSize: '2cqw' }}>{n}</span>
                <span className="mt-[0.6cqw] flex items-center gap-[0.8cqw] font-body font-medium" style={{ fontSize: '2.3cqw', color: c }}><span className="h-[1.4cqw] w-[1.4cqw] rounded-full" style={{ background: c }} />{v}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'profile':
      return (
        <div className="relative h-full w-full overflow-hidden rounded-[2.6cqw]" style={{ background: '#E8E6DC' }}>
          <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M-10,140 C60,120 120,160 310,90" stroke="#fff" strokeWidth="9" fill="none" />
            <path d="M80,-10 C90,60 70,130 110,210" stroke="#fff" strokeWidth="6" fill="none" />
            <path d="M200,-10 L230,210" stroke="#fff" strokeWidth="5" fill="none" />
            <rect x="140" y="20" width="44" height="30" rx="4" fill="#CFDCC4" />
          </svg>
          <div className="absolute left-[44%] top-[8%] flex flex-col items-center">
            <span className="flex h-[8cqw] w-[8cqw] items-center justify-center rounded-full rounded-br-none bg-forest" style={{ transform: 'rotate(45deg)' }}><span style={{ transform: 'rotate(-45deg)' }}><Mark fg={C.mist} accent={C.lime} size={16} /></span></span>
          </div>
          <div className="absolute bottom-[4%] left-[4%] right-[4%] rounded-[2.2cqw] bg-white p-[2.6cqw] text-ink shadow-[0_1cqw_4cqw_rgba(0,0,0,.2)]">
            <span className="block font-display font-semibold" style={{ fontSize: '3.6cqw' }}>Your business</span>
            <span className="block font-body text-ink/55" style={{ fontSize: '2.2cqw' }}>Your service · Your town</span>
            <div className="mt-[1.8cqw] grid grid-cols-4 gap-[1cqw]">
              {['Call', 'Directions', 'Website', 'Book'].map((b, i) => (
                <span key={b} className={`rounded-full py-[0.9cqw] text-center font-body font-medium ${i === 0 ? 'bg-forest text-mist' : 'border border-ink/15 text-forest'}`} style={{ fontSize: '2cqw' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      )
    case 'audit': {
      const rows: [string, number, number][] = [['Google search', 0.42, 0.78], ['Google Maps', 0.55, 0.7], ['ChatGPT', 0.2, 0.6], ['Gemini', 0.3, 0.52]]
      return (
        <div className="relative w-full rounded-[2.6cqw] bg-white p-[3cqw] text-ink">
          <Tag>Sample data</Tag>
          <span className="font-mono uppercase tracking-[0.16em] text-ink/45" style={{ fontSize: '1.9cqw' }}>Visibility vs. competitor</span>
          <div className="mt-[2cqw] flex flex-col gap-[1.6cqw]">
            {rows.map(([n, you, them]) => (
              <div key={n} className="grid grid-cols-[28%_1fr] items-center gap-[2cqw]">
                <span className="font-body font-medium" style={{ fontSize: '2.3cqw' }}>{n}</span>
                <div className="flex flex-col gap-[0.6cqw]">
                  <span className="h-[1.6cqw] rounded-full" style={{ width: `${you * 100}%`, background: C.lichen }} />
                  <span className="h-[1.6cqw] rounded-full bg-ink/15" style={{ width: `${them * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[2.4cqw] flex gap-[3cqw] font-body text-ink/55" style={{ fontSize: '2cqw' }}>
            <span className="flex items-center gap-[0.8cqw]"><span className="h-[1.4cqw] w-[1.4cqw] rounded-full" style={{ background: C.lichen }} />You</span>
            <span className="flex items-center gap-[0.8cqw]"><span className="h-[1.4cqw] w-[1.4cqw] rounded-full bg-ink/15" />Top competitor</span>
          </div>
        </div>
      )
    }
    case 'reviews':
      return (
        <div className="flex w-full items-center justify-center gap-[4cqw]">
          <Phone className="w-[42%]">
            <div className="flex flex-col gap-[1.4cqw] bg-[#F4F2EC] p-[2.4cqw]" style={{ minHeight: '34cqw' }}>
              <span className="text-center font-body text-ink/45" style={{ fontSize: '1.8cqw' }}>Text message · Today</span>
              <span className="max-w-[90%] rounded-[2cqw] rounded-bl-[0.4cqw] bg-white p-[2cqw] font-body leading-snug text-ink" style={{ fontSize: '2.2cqw' }}>Thanks for choosing us today. Would you leave a quick review? It really helps.</span>
              <span className="self-start rounded-full bg-forest px-[2.4cqw] py-[1cqw] font-body font-medium text-mist" style={{ fontSize: '2.1cqw' }}>Leave a review</span>
            </div>
          </Phone>
          <div className="flex w-[34%] flex-col items-center gap-[1.4cqw] rounded-[2.4cqw] bg-white p-[2.6cqw] text-ink">
            <span className="font-display font-semibold leading-tight" style={{ fontSize: '2.8cqw' }}>Scan to review us</span>
            <div className="aspect-square w-full"><Qr /></div>
            <span className="font-mono uppercase tracking-[0.14em] text-ink/45" style={{ fontSize: '1.6cqw' }}>Counter card</span>
          </div>
        </div>
      )
    case 'tracking': {
      const steps: [string, string][] = [['Click', 'Google · Meta'], ['Lead', 'Form or call'], ['Customer', 'Booked job']]
      return (
        <div className="flex w-full flex-col gap-[3cqw]">
          <div className="flex items-stretch gap-[1.4cqw]">
            {steps.map(([t, d], i) => (
              <div key={t} className="flex flex-1 items-center gap-[1.4cqw]">
                <div className={`flex flex-1 flex-col gap-[0.8cqw] rounded-[2.4cqw] p-[2.4cqw] ${i === 2 ? 'bg-lime text-forest' : 'border border-white/15 bg-black/20'}`}>
                  <span className="font-display font-semibold" style={{ fontSize: '3.6cqw' }}>{t}</span>
                  <span className={`font-body ${i === 2 ? 'text-forest/75' : 'text-mist/65'}`} style={{ fontSize: '2.1cqw' }}>{d}</span>
                  <span className={`mt-[0.6cqw] flex items-center gap-[0.8cqw] font-mono uppercase tracking-[0.14em] ${i === 2 ? 'text-forest' : 'text-lime'}`} style={{ fontSize: '1.7cqw' }}>
                    <svg viewBox="0 0 24 24" className="h-[2.2cqw] w-[2.2cqw]" fill="none" stroke="currentColor" strokeWidth={3.4}><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>Tracked
                  </span>
                </div>
                {i < 2 && <span className="text-lime" style={{ fontSize: '3cqw' }}>→</span>}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-[2cqw] rounded-[2.4cqw] bg-white/[0.06] px-[2.6cqw] py-[2cqw]">
            <span className="h-[1.6cqw] w-[1.6cqw] rounded-full bg-[#E8866B]" />
            <span className="font-body text-mist/80" style={{ fontSize: '2.3cqw' }}>Wasted spend flagged and paused</span>
          </div>
        </div>
      )
    }
    case 'ads': {
      const tiles: { ar: string; bg: string; fmt: string }[] = [
        { ar: '1/1', bg: C.lime, fmt: '1:1' }, { ar: '4/5', bg: C.dawn, fmt: '4:5' }, { ar: '9/16', bg: C.forest2, fmt: '9:16' }, { ar: '1/1', bg: '#9AA650', fmt: '1:1' },
        { ar: '9/16', bg: C.dawn, fmt: '9:16' }, { ar: '1/1', bg: C.forest2, fmt: '1:1' }, { ar: '4/5', bg: C.lime, fmt: '4:5' }, { ar: '1.91/1', bg: '#9AA650', fmt: '1.91:1' },
      ]
      return (
        <div className="flex w-full flex-col items-center gap-[1.6cqw]">
          {[tiles.slice(0, 4), tiles.slice(4)].map((row, ri) => (
            <div key={ri} className="flex items-end justify-center gap-[1.6cqw]">
              {row.map((t, i) => {
                const darkTile = t.bg === C.forest2
                return (
                  <div key={i} className="relative flex flex-col justify-between overflow-hidden rounded-[1.6cqw] p-[1.4cqw]" style={{ aspectRatio: t.ar, background: t.bg, height: '13cqw' }}>
                    <Mark fg={darkTile ? C.mist : C.forest} accent={darkTile ? C.lime : C.forest} size={10} />
                    <div className="flex flex-col gap-[0.6cqw]">{bar('80%', darkTile ? C.mist : C.forest, '1cqw')}{bar('55%', darkTile ? 'rgba(244,242,236,.5)' : 'rgba(30,56,38,.45)', '0.8cqw')}</div>
                    <span className={`absolute right-[1cqw] top-[1cqw] font-mono ${darkTile ? 'text-mist/60' : 'text-forest/60'}`} style={{ fontSize: '1.5cqw' }}>{t.fmt}</span>
                  </div>
                )
              })}
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
              <span className={`flex h-[3.8cqw] w-[3.8cqw] shrink-0 items-center justify-center rounded-full font-display font-semibold ${i === 5 ? 'bg-lime text-forest' : 'border border-white/20 text-mist'}`} style={{ fontSize: '2.4cqw' }}>{i + 1}</span>
              <div className="flex flex-1 items-center gap-[2cqw] rounded-[1.4cqw] bg-white px-[2.2cqw] py-[0.8cqw]">
                <svg viewBox="0 0 24 24" className="h-[2.8cqw] w-[2.8cqw] shrink-0" fill="none" stroke={C.forest} strokeWidth={2}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                <span className="flex flex-1 flex-col gap-[0.6cqw]">{bar(`${[62, 48, 70, 55, 66, 44][i]}%`, C.ink, '1.1cqw')}{bar(`${[80, 72, 60, 84, 70, 76][i]}%`, 'rgba(13,13,13,.15)', '0.8cqw')}</span>
              </div>
            </div>
          ))}
        </div>
      )
    case 'blog':
      return (
        <div className="grid w-full grid-cols-2 gap-[1.6cqw]">
          {[C.dawn, C.forest2, '#9AA650', C.sand].map((c, i) => (
            <div key={i} className="overflow-hidden rounded-[2cqw] bg-white">
              <div className="h-[5cqw]" style={{ background: `linear-gradient(160deg, ${c}, ${C.forest})` }} />
              <div className="flex flex-col gap-[0.7cqw] p-[1.4cqw]">
                {bar('86%', C.ink, '1.3cqw')}{bar('60%', C.ink, '1.3cqw')}
                <span className="mt-[0.4cqw] font-mono uppercase tracking-[0.12em] text-ink/45" style={{ fontSize: '1.6cqw' }}>1,200–1,500 words</span>
              </div>
            </div>
          ))}
        </div>
      )
    case 'clips':
      return (
        <div className="grid w-full grid-cols-10 gap-[1cqw]">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="relative flex aspect-[9/16] flex-col justify-end overflow-hidden rounded-[1.4cqw] p-[1cqw]" style={{ background: `linear-gradient(170deg, ${[C.dawn, C.forest2, '#9AA650', '#34484C', C.forest][i % 5]}, #0B0F0C)` }}>
              <svg viewBox="0 0 24 24" className="absolute left-1/2 top-[38%] h-[2.6cqw] w-[2.6cqw] -translate-x-1/2" fill="rgba(244,242,236,.85)"><path d="M8 5v14l11-7z" /></svg>
              <span className="rounded-[0.6cqw] bg-black/55 px-[0.8cqw] py-[0.5cqw]">{bar('90%', C.mist, '0.7cqw')}</span>
            </div>
          ))}
        </div>
      )
    case 'copy':
      return (
        <div className="w-[90%] overflow-hidden rounded-[2.4cqw] bg-white text-ink">
          <div className="flex gap-[0.6cqw] border-b border-ink/[0.07] bg-[#F1EFEA] px-[2cqw] pt-[1.4cqw]">
            {['Home', 'About', 'Services', 'Work', 'Contact'].map((t, i) => (
              <span key={t} className={`rounded-t-[1cqw] px-[1.6cqw] py-[0.9cqw] font-body ${i === 0 ? 'bg-white font-medium text-ink' : 'text-ink/50'}`} style={{ fontSize: '2cqw' }}>{t}</span>
            ))}
          </div>
          <div className="flex flex-col gap-[1.2cqw] p-[3cqw]">
            <span className="font-mono uppercase tracking-[0.14em] text-dawn" style={{ fontSize: '1.7cqw' }}>Headline</span>
            {bar('78%', C.ink, '2.2cqw')}{bar('50%', C.ink, '2.2cqw')}
            <span className="mt-[0.6cqw] font-mono uppercase tracking-[0.14em] text-dawn" style={{ fontSize: '1.7cqw' }}>Why us</span>
            {bar('92%', 'rgba(13,13,13,.15)', '1cqw')}{bar('84%', 'rgba(13,13,13,.15)', '1cqw')}{bar('66%', 'rgba(13,13,13,.15)', '1cqw')}
            <span className="mt-[0.6cqw] self-start rounded-full bg-forest px-[2.4cqw] py-[0.9cqw] font-body font-medium text-mist" style={{ fontSize: '2cqw' }}>Call to action</span>
          </div>
        </div>
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
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest [&::-webkit-scrollbar]:hidden"
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
              className={`absolute top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-white disabled:opacity-0 sm:flex sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 ${dir === 'prev' ? 'left-3' : 'right-3'}`}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}><path strokeLinecap="round" strokeLinejoin="round" d={dir === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} /></svg>
            </button>
          )
        })}
        <div className="flex items-center justify-center gap-1.5 border-b border-black/[0.06] bg-white py-3">
          {slides.map((_, i) => (
            <button key={i} type="button" onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === at}
              className="flex h-6 items-center justify-center px-0.5">
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === at ? 'w-6 bg-forest' : 'w-1.5 bg-ink/20'}`} />
            </button>
          ))}
        </div>
      </>}
    </section>
  )
}
