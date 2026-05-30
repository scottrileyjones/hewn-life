import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Refund Policy — Hewn Life',
  description: 'Hewn Life&apos;s policy on refunds, cancellations, and chargebacks.',
}

export default function Refund() {
  return (
    <LegalLayout
      title="Refund Policy"
      updated="May 30, 2026"
      intro="This Refund Policy describes when and how refunds are issued for services provided by Hewn Life LLC. Because our services are custom, labor-intensive, and begin promptly after engagement, this Policy is designed to be fair to both parties. It supplements our Terms of Service and any applicable statement of work (&ldquo;SOW&rdquo;)."
      sections={[
        {
          heading: 'Nature of Our Services',
          body: [
            'Hewn Life provides custom professional services — strategy, design, development, content, and advertising management. Work typically begins immediately after engagement and involves dedicated time, labor, and third-party costs. As such, fees are generally non-refundable once work has commenced, except as expressly stated in this Policy or required by law.',
          ],
        },
        {
          heading: 'Deposits & Project Fees',
          body: [
            'Deposits and upfront project fees reserve our time and cover initial work. They are non-refundable once work has begun. If you cancel a project before any work has started, you may be eligible for a refund of the deposit less a reasonable administrative fee and any non-recoverable costs already incurred on your behalf.',
          ],
        },
        {
          heading: 'Website in a Week & Fixed-Fee Projects',
          body: [
            'For fixed-fee productized offerings (such as Website in a Week), the fee covers a defined scope delivered on an accelerated timeline. Because production begins immediately, fees are non-refundable once the build has started. If you cancel before the kickoff/onboarding step, you may request a refund less any administrative and third-party costs already incurred.',
          ],
        },
        {
          heading: 'Recurring & Retainer Engagements',
          body: [
            'Recurring and retainer fees are billed in advance for the upcoming period and are non-refundable. You may cancel future billing periods in accordance with the notice requirements in your SOW or our Terms of Service. Cancellation stops future charges; it does not refund fees for the current or prior periods.',
          ],
        },
        {
          heading: 'Advertising Spend',
          body: [
            'Advertising spend (&ldquo;ad spend&rdquo;) paid to third-party platforms is governed by those platforms&apos; policies and is not refundable by Hewn Life. Any unspent, recoverable budget held in a managed account will be returned or credited where the platform permits. Our management fees are separate from ad spend and are non-refundable once services for the period have been performed.',
          ],
        },
        {
          heading: 'Third-Party Costs',
          body: [
            'Amounts paid for third-party products and services — including software, subscriptions, hosting, domains, stock assets, and media — are non-refundable to the extent they are non-recoverable from the provider.',
          ],
        },
        {
          heading: 'No Refunds for Results',
          body: [
            'Refunds are not available based on marketing, advertising, or business performance. We do not guarantee specific results, and dissatisfaction with outcomes is not a basis for a refund, as outcomes depend on factors outside our control.',
          ],
        },
        {
          heading: 'Requesting a Refund',
          body: [
            'To request a refund where this Policy permits one, email hello@hewnlife.com with your name, engagement details, and the reason for your request within fourteen (14) days of the relevant charge. We review requests in good faith and aim to respond within ten (10) business days. Approved refunds are issued to the original payment method.',
          ],
        },
        {
          heading: 'Chargebacks',
          body: [
            'If you have a billing concern, please contact us first so we can resolve it. Initiating a chargeback or payment dispute without first contacting us is a breach of our Terms of Service. We reserve the right to contest invalid chargebacks and to suspend Services and recover associated fees and costs.',
          ],
        },
        {
          heading: 'Changes to This Policy',
          body: [
            'We may update this Refund Policy from time to time. The version in effect at the time of your engagement applies to that engagement.',
          ],
        },
      ]}
    />
  )
}
