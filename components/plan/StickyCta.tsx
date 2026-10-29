'use client'
import { useEffect, useState } from 'react'
import CalButton from '@/components/CalButton'

/** Keeps the two next steps in reach once the reader scrolls past the hero. */
export default function StickyCta({ label, price, href, cta, showBook }: { label: string; price: string; href: string; cta: string; showBook: boolean }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('plan-hero')
    const end = document.getElementById('plan-close')
    if (!hero) return
    const onScroll = () => {
      const past = hero.getBoundingClientRect().bottom < 0
      const atEnd = end ? end.getBoundingClientRect().top < window.innerHeight : false
      setShow(past && !atEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div data-print-hide aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur transition-transform duration-300 sm:px-6 ${show ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p className="hidden font-body text-[15px] text-ink/80 sm:block">
          Recommended for you: <b className="text-ink">{label}</b> <span className="text-ink/55">· {price}</span>
        </p>
        <div className="flex w-full gap-2 sm:w-auto">
          {showBook && <CalButton className="flex-1 rounded-full border border-forest/25 px-5 py-3 font-body text-[14px] font-medium text-forest transition hover:bg-forest/5 sm:flex-none">Book a call</CalButton>}
          <a href={href} tabIndex={show ? 0 : -1} className="flex-1 rounded-full bg-forest px-5 py-3 text-center font-body text-[14px] font-medium text-mist transition hover:bg-forest-2 sm:flex-none">{cta}</a>
        </div>
      </div>
    </div>
  )
}
