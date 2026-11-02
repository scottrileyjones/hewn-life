import Link from 'next/link'
import Photo from '@/components/strata/Photo'
import type { Audience } from '@/lib/audiences'
import type { PhotoKey } from '@/lib/photos'

/**
 * Who a plan is for, as a card in the stat-card style: a photo with white type
 * (straight on it, or on faint glass), or a flat lime or forest card listing
 * the first few things we build. Links to that audience's tab on /who-we-serve.
 * Sized in container units: give the parent `container-type: inline-size`.
 */
export type AudienceLook = { photo: PhotoKey; glass?: boolean } | { color: 'lime' | 'forest' }

export default function AudienceCard({ a, look }: { a: Audience; look: AudienceLook }) {
  const href = `/who-we-serve#${a.id}`
  const head = <p className="font-display font-medium leading-[1.08] tracking-[-0.03em]" style={{ fontSize: '8.4cqw', textWrap: 'balance' } as React.CSSProperties}>{a.title} {a.accent}</p>
  const pill = (bg: string, fg: string) => (
    <span className="inline-block rounded-full px-[2.6cqw] py-[0.9cqw] font-body font-semibold uppercase leading-none tracking-[0.05em]" style={{ fontSize: '3.1cqw', background: bg, color: fg }}>{a.tab}</span>
  )
  const more = <span className="mt-[3cqw] inline-block font-body font-medium underline decoration-current/40 underline-offset-4" style={{ fontSize: '3.9cqw' }}>See what we build →</span>

  if ('photo' in look) {
    return (
      <Link href={href} className="group relative isolate flex h-full w-full flex-col justify-between overflow-hidden p-[6.5cqw] text-white" style={{ background: '#2A4A32' }}>
        <Photo name={look.photo} w={680} h={850} sizes="(min-width: 1024px) 300px, 78vw" className="-z-20 transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(13,20,15,.4), rgba(0,0,0,.04) 30%, rgba(0,0,0,.04) 45%, rgba(13,20,15,.8))' }} />
        <div>{pill('#FFFFFF', '#14231A')}</div>
        {look.glass
          ? <div className="rounded-[4.6cqw] border border-white/30 bg-white/[0.12] p-[4.6cqw] backdrop-blur-xl">{head}{more}</div>
          : <div>{head}{more}</div>}
      </Link>
    )
  }
  const lime = look.color === 'lime'
  return (
    <Link href={href} className="flex h-full w-full flex-col justify-between overflow-hidden p-[6.5cqw] transition hover:brightness-[1.03]" style={{ background: lime ? '#D6F28B' : '#1E3826', color: lime ? '#14231A' : '#FFFFFF' }}>
      <div>{pill(lime ? '#1E3826' : '#D6F28B', lime ? '#FFFFFF' : '#14231A')}</div>
      <div>
        {head}
        <ul className="mt-[4cqw] border-t" style={{ borderColor: lime ? 'rgba(20,35,26,.15)' : 'rgba(255,255,255,.18)' }}>
          {a.build.slice(0, 3).map(b => (
            <li key={b} className="border-b py-[2.2cqw] font-body leading-snug" style={{ fontSize: '3.7cqw', borderColor: lime ? 'rgba(20,35,26,.15)' : 'rgba(255,255,255,.18)' }}>{b}</li>
          ))}
        </ul>
        {more}
      </div>
    </Link>
  )
}
