import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Refunds & Cancellations — Hewn Life',
  description: 'How Hewn Life billing, automatic renewals, cancellations and refunds work.',
}

export default function Refund() {
  return (
    <LegalLayout
      title="Refunds & Cancellations"
      updated="October 29, 2026"
      intro="This policy explains how billing, automatic renewal, cancellation and refunds work for Hewn Life plans and projects. It is part of our Terms of Service."
      summary={[
        'Monthly plans renew each month until you cancel. Cancel anytime at hewn.life/cancel; you keep service until the end of the month you’ve paid for.',
        'We don’t charge cancellation fees and you don’t need to call anyone to cancel.',
        'Website in a Day: full refund if you cancel before we start the build. Once the build starts, the fee isn’t refundable.',
        'Ad spend and third-party costs are paid to those platforms and follow their policies.',
      ]}
      sections={[
        {
          heading: 'Monthly plans',
          body: [
            'Hewn, Wrought and Forged plans are billed monthly in advance on the day you subscribe, and renew automatically on the same day each month at the price shown at checkout (plus any applicable tax) until you cancel.',
            'Because each month’s work is planned and resourced at the start of the month, monthly fees aren’t refundable for a month that has started, and we don’t give partial-month refunds when you cancel.',
          ],
        },
        {
          heading: 'Annual billing',
          body: [
            'If you choose annual billing, you pay for 12 months in advance at the discounted rate shown at checkout. Annual plans renew for another year unless you cancel before the renewal date, and we email you a reminder before each renewal.',
            'If you cancel within 14 days of an annual charge, we’ll refund the amount paid minus the regular monthly price for any month in which we’ve already started work. After 14 days, annual fees aren’t refundable, but cancelling stops the next renewal.',
          ],
        },
        {
          heading: 'How to cancel',
          body: [
            'Go to hewn.life/cancel and enter the email address on your account. We’ll email you a link; one click cancels your subscription at the end of the current billing period, and we’ll send you a confirmation. You can also cancel by emailing hello@hewn.life from that address.',
            'There is no cancellation fee. After you cancel, you keep access to the Services until the end of the period you’ve paid for, then billing stops. We’ll hand over completed, paid-for deliverables as described in our Terms.',
          ],
        },
        {
          heading: 'Website in a Day',
          body: [
            'Website in a Day is a one-time $999 purchase. If you cancel before we’ve started your build, we’ll refund it in full. Because the work starts as soon as your brief is complete and payment clears, the fee isn’t refundable once the build has started.',
            'Your purchase includes one round of edits after launch. If something we delivered doesn’t match your brief, tell us and we’ll fix it.',
          ],
        },
        {
          heading: 'Projects under a statement of work',
          body: [
            'For custom projects, the refund and cancellation terms in your SOW apply. Where an SOW doesn’t address it, deposits are refundable only if you cancel before work begins, less any third-party costs already incurred for you.',
          ],
        },
        {
          heading: 'Ad spend and third-party costs',
          body: [
            'Advertising spend is paid to the advertising platforms and governed by their policies; we can’t refund it. Where the platform allows, unspent prepaid budget in an account we manage will be returned to you or left in your account. Software, domains, stock assets and other third-party purchases made for you are refundable only to the extent the provider refunds them.',
          ],
        },
        {
          heading: 'Results',
          body: [
            'We don’t offer refunds based on marketing results, because results depend on many factors outside our control. See our Results Disclaimer.',
          ],
        },
        {
          heading: 'Requesting a refund',
          body: [
            'Email hello@hewn.life with your name, the purchase and the reason. We aim to respond within 5 business days. Approved refunds go back to the original payment method and usually appear within 5–10 business days.',
            'If you have a billing problem, please contact us before disputing a charge with your bank. We can usually fix it faster. This doesn’t limit any rights you have with your card issuer.',
          ],
        },
        {
          heading: 'Changes',
          body: [
            'We may update this policy. The version in effect when you were charged applies to that charge. We’ll email active subscribers before any change that affects their renewals.',
          ],
        },
      ]}
    />
  )
}
