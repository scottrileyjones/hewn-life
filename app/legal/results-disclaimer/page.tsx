import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Results Disclaimer — Hewn Life',
  description: 'How to read Hewn Life’s track record, statistics, projections, scores and growth plans.',
}

export default function ResultsDisclaimer() {
  return (
    <LegalLayout
      title="Results Disclaimer"
      updated="October 29, 2026"
      intro="We want you to make decisions with clear eyes. This page explains what the figures, track record, projections and plans on our Site and in our emails mean, and what they don’t."
      summary={[
        'Our track record comes from work our team did before founding Hewn Life. It isn’t typical and isn’t a promise.',
        'Industry statistics are from the published research we cite, not from Hewn Life clients.',
        'ROI estimates, health scores and growth plans are estimates from your answers. Your results will vary.',
      ]}
      sections={[
        {
          heading: 'Our track record',
          body: [
            'Hewn Life is a new agency. The track record we describe, including growing a national telemedicine brand from launch to a $10 million company, building the growth engine behind a business that was later acquired, and helping raise a seed round, reflects work our team did in previous roles, before Hewn Life was founded. Those results depended on the businesses’ products, markets, funding, teams and timing as well as on marketing.',
            'These outcomes are not typical, and you should not expect similar results. We describe this work without naming the businesses involved, to respect confidentiality.',
          ],
        },
        {
          heading: 'Industry statistics',
          body: [
            'Statistics about small businesses, marketers and advertising costs come from the third-party research we cite next to them, such as surveys by Constant Contact, LocaliQ, Gartner and others. They describe those surveys’ respondents, not Hewn Life clients, and we don’t independently verify them.',
          ],
        },
        {
          heading: 'Calculators, scores and projections',
          body: [
            'The ROI calculator, marketing health score, readout and any revenue or growth projection are estimates generated from the answers you give and general assumptions. They aren’t audits of your business, and they aren’t forecasts or promises of what you will earn.',
          ],
        },
        {
          heading: 'Personal growth plans',
          body: [
            'Personal growth plans are written by AI from your answers and our published playbook. They describe what we would likely recommend and do. A plan isn’t a proposal or a guarantee; your actual scope is what you buy or agree in writing. AI can make mistakes, so tell us if anything looks wrong.',
          ],
        },
        {
          heading: 'Testimonials',
          body: [
            'If we publish client testimonials or case studies, they will reflect real clients’ experiences, we’ll disclose any compensation or relationship that could affect how you view them, and we’ll note when results are not typical.',
          ],
        },
        {
          heading: 'Your decisions',
          body: [
            'Marketing results depend on your offer, pricing, market, competition, budget, timing and execution, and on platforms we don’t control. Nothing on the Site is financial, legal or tax advice. Consider your own circumstances, and get professional advice where you need it.',
          ],
        },
      ]}
    />
  )
}
