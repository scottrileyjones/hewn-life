import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Accessibility — Hewn Life',
  description: 'Hewn Life’s commitment to an accessible website, and how to tell us about a barrier.',
}

export default function Accessibility() {
  return (
    <LegalLayout
      title="Accessibility Statement"
      updated="October 29, 2026"
      intro="We want everyone to be able to use hewn.life, learn about our Services and buy from us, including people who use assistive technology."
      sections={[
        {
          heading: 'Our goal',
          body: [
            'We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. We design with sufficient color contrast, readable type sizes, descriptive text for meaningful images, keyboard-accessible controls and support for reduced-motion settings.',
          ],
        },
        {
          heading: 'Known limitations',
          body: [
            'Some parts of the Site rely on third-party services, such as Stripe for payments and Cal.com for booking, whose accessibility we don’t fully control. Some decorative graphics, such as our terrain illustrations, are intentionally hidden from screen readers because they don’t carry information.',
          ],
        },
        {
          heading: 'Tell us about a barrier',
          body: [
            'If anything on the Site is hard to use, email hello@hewn.life with the page and the problem. We’ll reply within 2 business days and, while we fix it, help you get the information or Service another way, such as by email or phone.',
          ],
        },
        {
          heading: 'Ongoing work',
          body: [
            'We review new pages and features for accessibility before they launch and fix reported issues as a priority.',
          ],
        },
      ]}
    />
  )
}
