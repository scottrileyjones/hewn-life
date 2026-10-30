import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Privacy Policy — Hewn Life',
  description: 'What Hewn Life collects, why, who we share it with, how long we keep it, and the choices and rights you have.',
}

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="October 30, 2026"
      intro="This Privacy Policy explains how Hewn Holdings LLC, doing business as Hewn Life (“Hewn Life,” “we,” “us” or “our”) collects, uses, shares and protects personal information when you visit hewn.life, fill in one of our forms, book a call, receive our emails or buy our Services. It doesn’t cover personal data we process for clients about their own customers; that is governed by our Data Processing Addendum and the client’s own privacy policy."
      summary={[
        'We collect what you give us in our forms (like your name, email, business and answers) plus usage data from cookies if you accept them.',
        'We use it to give you your readout and growth plan, reply to you, run the Services you buy, and improve the Site.',
        'Your growth plan is written by AI (Anthropic’s Claude) from your answers. We don’t let AI providers train on your data.',
        'We don’t sell your personal information. We share it only with the service providers listed below.',
        'You can unsubscribe from our emails at any time, change your cookie choice, and ask us to access, correct or delete your data.',
      ]}
      sections={[
        {
          heading: 'Information we collect',
          body: ['Information you give us:'],
          list: [
            'Contact details: name, email address, phone number, business name and state.',
            'Business details and answers: annual revenue range, goals, budget, challenges, team and anything else you tell us in the ROI calculator, contact form or Website in a Day brief.',
            'Booking details when you schedule a call, and anything you tell us during it or by email.',
            'Purchase details: plan, amounts and billing contact. Card details are collected by Stripe; we never see or store your full card number.',
            'Client materials and account access you give us during an engagement.',
          ],
        },
        {
          heading: 'Information collected automatically',
          body: [
            'If you accept cookies, we and our analytics and advertising partners collect device and usage data such as IP address, browser and device type, pages viewed, links clicked, referring site and approximate location. If you decline, these tags run in a restricted mode that doesn’t store analytics or advertising cookies. See our Cookie Policy.',
            'When you open a growth plan we send you, we record that it was opened so we don’t send unnecessary follow-ups.',
          ],
        },
        {
          heading: 'Information we create',
          body: [
            'From your answers we generate a marketing health score, a recommended plan and a personal growth plan describing likely challenges, our approach and a 90-day roadmap. These are inferences about your business’s marketing needs. They’re used to help you and to prepare for any call, and they don’t produce legal or similarly significant effects for you.',
          ],
        },
        {
          heading: 'How we use information',
          body: ['We use personal information to:'],
          list: [
            'Show your readout and send your personal growth plan, a copy to our team, and up to one follow-up about it.',
            'Respond to inquiries, schedule and prepare for calls.',
            'Provide, bill for and support the Services you buy, including subscription renewals and cancellations.',
            'Send occasional marketing emails if you agreed to receive them. Every email has an unsubscribe link.',
            'Measure and improve the Site and our marketing, if you accepted analytics and advertising cookies.',
            'Protect the Site, prevent fraud, comply with law and enforce our Terms.',
          ],
        },
        {
          heading: 'AI processing',
          body: [
            'To write your personal growth plan, we send your form answers (including your name, business name and the details you provided) to Anthropic, which provides the Claude AI model, through its commercial API. Anthropic processes this data on our behalf to return the plan and doesn’t use it to train its models. The statistics, sources and prices in your plan come from us, not from the AI. We store the finished plan with your record.',
          ],
        },
        {
          heading: 'Who we share information with',
          body: ['We don’t sell your personal information. We share it only with service providers that process it for us under contract, and only as needed:'],
          list: [
            'Vercel — website hosting.',
            'Airtable — our lead and client records, including client portal messages.',
            'Anthropic — AI generation of personal growth plans.',
            'Resend — sending our emails, including client portal sign-in links and alerts.',
            'Google Workspace — our email and documents.',
            'Stripe — payments, subscriptions and billing.',
            'Cal.com — call scheduling.',
            'Google (Tag Manager, Analytics and Ads) and other advertising platforms, only if you accept cookies.',
          ],
        },
        {
          heading: 'Other disclosures',
          body: [
            'We may disclose information to professional advisers under confidentiality, to comply with law or a valid legal request, to protect the rights and safety of Hewn Life, our clients or others, or as part of a merger, acquisition or sale of our business, in which case this Policy continues to apply to the information transferred.',
          ],
        },
        {
          heading: 'Advertising, “sharing” and Global Privacy Control',
          body: [
            'If you accept cookies, advertising platforms such as Google may use data collected on the Site to measure and personalize ads. Some state laws treat this as “sharing” for cross-context behavioral advertising or “targeted advertising.” You can opt out by declining cookies in our banner, changing your choice later with “Cookie settings” in the site footer, or by turning on Global Privacy Control (GPC) in your browser. When we detect GPC, we don’t enable advertising cookies even if you accept the banner.',
          ],
        },
        {
          heading: 'Emails',
          body: [
            'When you submit a form, we email you your growth plan and may send one follow-up a few days later if you agreed to receive marketing emails. Clients also receive service and billing emails. You can unsubscribe from marketing emails with the link in any of them or by emailing hello@hewn.life. We’ll still send transactional emails such as receipts and renewal notices.',
            'We don’t send text messages without your separate consent. Giving us your phone number doesn’t sign you up for texts.',
          ],
        },
        {
          heading: 'How long we keep information',
          list: [
            'Leads who don’t become clients: up to 3 years after our last contact, then deleted.',
            'Clients: for the engagement and up to 7 years afterwards for tax, accounting and legal purposes.',
            'Unsubscribe records: kept so we can continue to honor your choice.',
            'Analytics data: kept for 14 months in Google Analytics.',
          ],
          body: ['We keep personal information only as long as we need it for the purposes above:'],
        },
        {
          heading: 'Security',
          body: [
            'We use reasonable administrative, technical and physical safeguards, including encrypted connections, access controls and reputable providers. No system is perfectly secure, so we can’t guarantee absolute security. If a breach affects your personal information, we’ll notify you as the law requires.',
          ],
        },
        {
          heading: 'Your rights and choices',
          body: [
            'Wherever you live, you can ask us to tell you what personal information we hold about you, give you a copy, correct it or delete it, and you can opt out of marketing emails and of targeted advertising. Residents of some states (including California, Colorado, Connecticut, Oregon, Texas, Utah and Virginia) and of the EU and UK have these rights by law, and may also have the right to appeal our decision on a request.',
            'To make a request, email hello@hewn.life from the address we have on file, or tell us how to reach you so we can verify the request. You can use an authorized agent with your signed permission. We’ll respond within 45 days, won’t charge you, and won’t treat you differently for exercising your rights. If we deny a request, you can appeal by replying to our decision; we’ll respond to an appeal within 60 days.',
          ],
        },
        {
          heading: 'Legal bases (EU and UK visitors)',
          body: [
            'If EU or UK law applies, we rely on your consent (for cookies and marketing emails, which you can withdraw at any time), on performing a contract with you (for Services you buy), on our legitimate interests in responding to inquiries and running our business, and on legal obligations. You can complain to your local data protection authority. We are based in the United States and our providers mainly process data in the United States.',
          ],
        },
        {
          heading: 'Children',
          body: [
            'The Site and Services are for businesses and adults. We don’t knowingly collect personal information from anyone under 16. If you believe a child has given us information, contact us and we’ll delete it.',
          ],
        },
        {
          heading: 'Links to other sites',
          body: [
            'The Site links to other services, such as Cal.com for booking and Stripe for checkout. Their own privacy policies apply to information you give them.',
          ],
        },
        {
          heading: 'Changes to this policy',
          body: [
            'We’ll post any changes here with a new “Last updated” date. If a change materially affects how we use information we already have, we’ll tell you by email or on the Site before it takes effect.',
          ],
        },
        {
          heading: 'Contact us',
          body: [
            'Questions or requests: hello@hewn.life, or Hewn Holdings LLC, 285 N Main St #115, Kaysville, UT 84037, United States.',
          ],
        },
      ]}
    />
  )
}
