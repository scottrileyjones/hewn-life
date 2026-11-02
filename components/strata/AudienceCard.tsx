import Link from 'next/link'
import Photo from '@/components/strata/Photo'
import type { Audience } from '@/lib/audiences'
import type { PhotoKey } from '@/lib/photos'

/**
 * Who we build for, as a card in the stat-card style: the audience tag, a round
 * arrow, then one headline and a quiet line on who it's for. A photo with white
 * type (straight on it, or on faint glass) or a flat lime or forest card. The
 * whole card links to that audience's tab on /who-we-serve.
 * Sized in container units: give the parent `container-type: inline-size`.
 */
export type AudienceLook = { photo: PhotoKey; glass?: boolean } | { color: 'lime' | 'forest' }

const Arrow = ({ bg, fg }: { bg: string; fg: string }) => (
  <span className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:-rotate-45" style={{ width: '9.5cqw', height: '9.5cqw', background: bg, color: fg }} aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: '4.4cqw', height: '4.4cqw' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" /></svg>
  </span>
)

export default function AudienceCard({ a, look }: { a: Audience; look: AudienceLook }) {
  const photo = 'photo' in look
  const lime = !photo && look.color === 'lime'
  const fg = lime ? '#14231A' : '#FFFFFF'
  const top = (
    <div className="flex items-start justify-between">
      <span className="inline-block rounded-full px-[2.6cqw] py-[0.9cqw] font-body font-semibold uppercase leading-none tracking-[0.05em]"
        style={{ fontSize: '3.1cqw', background: photo ? '#FFFFFF' : lime ? '#1E3826' : '#D6F28B', color: photo || !lime ? '#14231A' : '#FFFFFF' }}>{a.tab}</span>
      <Arrow bg={photo ? 'rgba(255,255,255,.2)' : lime ? '#1E3826' : 'rgba(255,255,255,.12)'} fg={lime ? '#D6F28B' : '#FFFFFF'} />
    </div>
  )
  const text = (
    <div>
      <p className="font-display font-medium leading-[1.08] tracking-[-0.03em]" style={{ fontSize: '8.4cqw', textWrap: 'balance' } as React.CSSProperties}>{a.title} {a.accent}</p>
      <p className="mt-[2.4cqw] font-body leading-snug opacity-75" style={{ fontSize: '3.8cqw' }}>{a.eyebrow}</p>
    </div>
  )

  return (
    <Link href={`/who-we-serve#${a.id}`} aria-label={`${a.tab}: ${a.title} ${a.accent}`}
      className="group relative isolate flex h-full w-full flex-col justify-between overflow-hidden p-[6.5cqw]"
      style={{ background: photo ? '#2A4A32' : lime ? '#D6F28B' : '#1E3826', color: fg }}>
      {photo && <>
        <Photo name={look.photo} w={680} h={850} sizes="(min-width: 1024px) 300px, 78vw" className="-z-20 transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(13,20,15,.35), rgba(0,0,0,0) 28%, rgba(0,0,0,0) 45%, rgba(13,20,15,.8))' }} />
      </>}
      {top}
      {photo && look.glass
        ? <div className="rounded-[4.6cqw] border border-white/25 bg-white/[0.12] p-[4.6cqw] backdrop-blur-xl">{text}</div>
        : text}
    </Link>
  )
}
