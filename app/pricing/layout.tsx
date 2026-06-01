export { metadata } from './metadata'

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does Hewn Life cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'Hewn Life offers flat-fee monthly retainers for full-service marketing. Pricing starts at $2,500/month. There are no percentage-of-spend fees, no project markups, and no long-term contracts required. You can see full plan details and check out directly on the pricing page.' },
    },
    {
      '@type': 'Question',
      name: 'Does Hewn Life require a long-term contract?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Hewn Life works on monthly agreements. There are no long-term contracts. You can cancel or change plans month to month.' },
    },
    {
      '@type': 'Question',
      name: 'What is included in a Hewn Life retainer?',
      acceptedAnswer: { '@type': 'Answer', text: 'Every Hewn Life retainer includes all six service pillars: Brand Foundation, Digital Presence (website + SEO), Lead & Revenue Engine (paid media + funnels), Customer Experience (scheduling + automation), Reputation & Social Proof, and Business Advisory (fractional CMO). The scope and depth scales with the tier.' },
    },
    {
      '@type': 'Question',
      name: 'Does Hewn Life charge a percentage of ad spend?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Hewn Life charges a flat monthly fee only. There are no percentage-of-spend fees on paid media. Ad spend budgets are set by the client and paid directly to the platforms.' },
    },
    {
      '@type': 'Question',
      name: 'How quickly does Hewn Life onboard new clients?',
      acceptedAnswer: { '@type': 'Answer', text: 'Hewn Life onboards within 48 hours of purchase. After checkout, you receive a link to schedule your onboarding call. Work typically begins in week one.' },
    },
  ],
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  )
}
