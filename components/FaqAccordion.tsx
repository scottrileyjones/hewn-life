'use client'
import { useState } from 'react'

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: "Do you require long-term contracts?",
    answer: "No. We work on monthly agreements. We earn your continued business by delivering results."
  },
  {
    question: "What businesses are the best fit for Hewn Life?",
    answer: "Established businesses doing $500K+ in annual revenue that are ready to invest in marketing as a growth driver — not a cost center."
  },
  {
    question: "Who will actually be doing my work?",
    answer: "The founder oversees every account directly. You are not handed off to a junior account manager. You get the experience you are paying for."
  },
  {
    question: "How is this different from hiring a freelancer?",
    answer: "A freelancer executes tasks. Hewn Life operates as your fractional CMO — strategic, embedded, and building systems that outlast any single deliverable."
  },
  {
    question: "What if I just need one specific project?",
    answer: "We offer clear à la carte flat-fee services for one-off needs. No retainer required."
  },
  {
    question: "What's your process for getting started?",
    answer: "Book a discovery call. We do a deep-dive into your business (weeks 1–2), then launch a Foundation Sprint (weeks 3–8) to get your brand, website, and core systems live."
  }
]

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto">
      {faqs.map((faq, i) => (
        <div key={i} className="border-b border-white/[0.08]">
          <button
            className="w-full text-left py-6 flex items-center justify-between gap-4 group"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="font-body text-base text-cream group-hover:text-ember transition-colors">
              {faq.question}
            </span>
            <span className={`text-ember transition-transform duration-300 flex-shrink-0 ${openIndex === i ? 'rotate-45' : ''}`}>
              +
            </span>
          </button>
          {openIndex === i && (
            <div className="pb-6">
              <p className="font-body text-sm text-ash leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
