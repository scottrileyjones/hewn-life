'use client'
import { useState } from 'react'

const faqs = [
  { q: 'Do you require long-term contracts?', a: 'No. We work on monthly agreements and earn your continued business by delivering results.' },
  { q: 'What businesses are the best fit?', a: 'Established businesses doing $500K+ in annual revenue that are ready to treat marketing as a growth investment, not a cost center.' },
  { q: 'Who actually does the work?', a: 'The founder oversees every account directly, backed by an AI-native production line. You are never handed off to a junior account manager.' },
  { q: 'What does “AI-native” mean in practice?', a: 'AI does the volume: creative variants, landing pages, content drafts and reporting. Senior people do the judgment: strategy, taste and what to scale.' },
  { q: 'Do I get a live dashboard?', a: 'Yes. Every paid-media client gets a live growth dashboard with spend, cost per customer and a verdict on every strategy, refreshed daily.' },
  { q: 'Do you take a percentage of ad spend?', a: 'Never. One flat monthly fee, whatever you spend on media. Our incentive is your efficiency, not your budget.' },
  { q: 'What if I just need one project?', a: 'We offer flat-fee à la carte services for one-off needs, such as a website, a brand refresh or a creative pack. No retainer required.' },
  { q: 'How fast do we get started?', a: 'Onboarding begins within 48 hours. The nine-pillar gap analysis lands in week one and the first quick wins go live inside 30 days.' },
]

export default function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {faqs.map((f, i) => (
        <div key={f.q} className="rounded-2xl bg-white border border-black/[0.06] self-start">
          <button
            className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-body text-sm font-medium text-iron">{i + 1}. {f.q}</span>
            <span className={`text-iron/50 text-lg leading-none transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
          </button>
          {open === i && <p className="px-5 pb-5 -mt-1 font-body text-sm text-slate leading-relaxed">{f.a}</p>}
        </div>
      ))}
    </div>
  )
}
