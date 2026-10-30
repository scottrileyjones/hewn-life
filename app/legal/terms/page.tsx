import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Terms of Service — Hewn Life',
  description: 'The terms that govern use of the Hewn Life website and the purchase of Hewn Life services, plans and subscriptions.',
}

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="October 30, 2026"
      intro="These Terms of Service (“Terms”) are an agreement between you and Hewn Holdings LLC, a Utah limited liability company doing business as Hewn Life (“Hewn Life,” “we,” “us” or “our”). They govern your use of hewn.life and any related pages, tools and emails (the “Site”) and your purchase and use of our marketing services, plans and subscriptions (the “Services”). If you are buying on behalf of a business, “you” means that business, and you confirm you have authority to bind it."
      summary={[
        'Using the Site or buying from us means you agree to these Terms, our Privacy Policy and our Refunds & Cancellations policy.',
        'Monthly plans renew automatically each month until you cancel. You can cancel online at any time; it takes effect at the end of the period you’ve paid for.',
        'Website in a Day is a one-time $999 purchase with a defined scope, delivered within 24 hours of a complete brief and cleared payment.',
        'We don’t guarantee marketing results. Projections, scores and plans are estimates, not promises.',
        'You own your final deliverables once they’re paid for. We keep our own tools and templates.',
        'Some features, such as your personal growth plan, are written with AI from the answers you give us.',
        'Utah law applies. Disputes go to the courts in Davis County, Utah, or small-claims court.',
      ]}
      sections={[
        {
          heading: 'Agreeing to these Terms',
          body: [
            'By using the Site, submitting a form, booking a call, or buying a plan or project, you agree to these Terms. If you don’t agree, please don’t use the Site or Services.',
            'Some engagements are also covered by a proposal, statement of work or order form (an “SOW”). Where an SOW signed by both parties conflicts with these Terms, the SOW controls for that engagement.',
            'You must be at least 18 years old and able to form a binding contract to buy Services.',
          ],
        },
        {
          heading: 'Changes to these Terms',
          body: [
            'We may update these Terms from time to time. We’ll post the new version here with a new “Last updated” date, and for material changes that affect an active subscription we’ll email you at least 14 days before they take effect. Changes don’t apply retroactively. If you don’t agree to a change, you can cancel before it takes effect.',
          ],
        },
        {
          heading: 'Our Services',
          body: [
            'We provide marketing services, including strategy, brand, website design and development, search and AI-search optimization, paid media management, creative and content production, email and CRM, analytics and reporting. What each plan includes is described on our Pricing page at the time you buy, or in your SOW.',
            'Anything not included in your plan or SOW is out of scope. We’re happy to quote additional work separately.',
          ],
        },
        {
          heading: 'Monthly plans and automatic renewal',
          body: [
            'Our Hewn, Wrought and Forged plans are subscriptions. When you subscribe, you authorize us (through our payment processor, Stripe) to charge the plan price shown at checkout, plus any applicable tax, on the day you subscribe and again on the same day of each following billing period until you cancel.',
            'Plans billed annually are charged for the full year in advance and renew for another year unless you cancel before the renewal date. We’ll email you a reminder before an annual renewal.',
            'You can cancel at any time online at hewn.life/cancel, or by emailing hello@hewn.life. Cancellation takes effect at the end of the current billing period, and you keep access to the Services until then. See our Refunds & Cancellations policy for details.',
            'We may change plan prices for future billing periods. We’ll email you at least 30 days before a price change applies to your subscription, and you can cancel before it takes effect.',
          ],
        },
        {
          heading: 'Website in a Day',
          body: [
            'Website in a Day is a one-time purchase for a custom website of defined scope: design, copy, build, hosting setup and launch, plus one round of edits. The 24-hour delivery window starts once we have both your complete brief and cleared payment. If your brief is missing information we need, we’ll tell you, and the window starts when it’s complete.',
            'Domains, third-party software and ongoing hosting beyond any period stated at purchase are not included unless the offer says so. Additional edits and features are quoted separately.',
          ],
        },
        {
          heading: 'Payment and taxes',
          body: [
            'Prices are in US dollars. Payments are processed by Stripe; we don’t see or store your full card number. You agree to keep your payment details current. If a payment fails, we may retry it and pause Services until the balance is paid.',
            'Invoiced amounts are due on receipt unless your SOW says otherwise. Overdue amounts may accrue interest at 1.5% per month or the highest rate allowed by law, whichever is lower. You are responsible for applicable sales and similar taxes.',
            'Third-party costs, including advertising spend, software, stock assets, domains and paid tools, are separate from our fees. You either pay them directly or we bill them at cost, as agreed in writing.',
          ],
        },
        {
          heading: 'Advertising and third-party platforms',
          body: [
            'When we manage advertising for you, you authorize us to operate the relevant accounts within the budget you approve. Platforms such as Google, Meta and others set their own rules and can reject ads, limit delivery or suspend accounts for reasons outside our control. We aren’t responsible for platform decisions, outages or policy changes.',
            'You are responsible for the claims made about your products and services, and for making sure they are truthful, substantiated and lawful in your industry. Where your business is regulated (for example healthcare, finance, legal or alcohol), you are responsible for final approval of all marketing for regulatory compliance.',
          ],
        },
        {
          heading: 'No guaranteed results',
          body: [
            'Marketing outcomes depend on many things we don’t control, including your offer, pricing, market, competition, platform algorithms and how quickly you act on recommendations. We don’t guarantee any particular ranking, traffic, lead volume, conversion rate, cost per acquisition, return on ad spend or revenue.',
            'The ROI calculator, health scores, readouts, personal growth plans, projections, benchmarks and case studies on the Site are estimates and illustrations. They are not promises or guarantees of future performance. See our Results Disclaimer.',
          ],
        },
        {
          heading: 'AI-assisted features',
          body: [
            'We use AI tools, including models provided by Anthropic, to help produce some content and Services. Your personal growth plan, for example, is written by AI from the answers you give us, using statistics and pricing we supply. AI output can contain mistakes. Treat plans and readouts as a starting point for a conversation, not as professional, legal or financial advice.',
            'Deliverables we produce for clients with AI assistance are reviewed by our team before delivery. We don’t use your confidential information to train AI models, and we use providers whose terms don’t permit them to train on the data we send.',
          ],
        },
        {
          heading: 'Your responsibilities',
          body: ['To let us do our work, you agree to:'],
          list: [
            'Give us timely access to accounts, assets, approvals and people we reasonably need.',
            'Provide accurate information, and only materials you have the right to use and to let us use.',
            'Review and approve work within agreed timeframes. Delays on your side may move delivery dates.',
            'Comply with applicable laws, including advertising, privacy and anti-spam laws, and the policies of the platforms we use for you.',
            'Have a lawful basis, including any required consent, for customer data you ask us to use (for example email lists or advertising audiences).',
          ],
        },
        {
          heading: 'Protected health information',
          body: [
            'Our standard Services are not designed to receive protected health information (“PHI”) as defined under HIPAA. Please don’t send us PHI, such as patient lists or appointment data, unless we have first signed a Business Associate Agreement with you. If we sign one, it controls how we handle PHI.',
          ],
        },
        {
          heading: 'Using the Site',
          body: ['You agree not to:'],
          list: [
            'Use the Site for anything unlawful, deceptive or harmful, or submit false information in our forms.',
            'Scrape, copy or resell the Site or its content, or use automated means to submit forms.',
            'Interfere with the Site’s security or operation, or try to access data you aren’t authorized to access.',
            'Use the Site or Services to send spam or to market products that are illegal where they are sold.',
          ],
        },
        {
          heading: 'Intellectual property',
          body: [
            'Once you have paid all fees for them, you own the final deliverables we create specifically for you, except for third-party materials (such as licensed fonts, stock images and software, which stay subject to their own licenses) and our own pre-existing tools, frameworks, templates, code and know-how (“Hewn Life Materials”).',
            'We give you a perpetual, non-exclusive license to use any Hewn Life Materials built into your deliverables, for use with those deliverables. Until fees are paid, deliverables remain ours. You keep ownership of everything you give us and license it to us to perform the Services.',
            'Unless you tell us in writing not to, we may show non-confidential work in our portfolio and describe the engagement in general terms. We won’t publish your results or name you in a case study without your permission.',
            'The Site, our brand and our content are owned by Hewn Life and protected by law. You may not use them without our permission.',
          ],
        },
        {
          heading: 'Confidentiality',
          body: [
            'Each of us will keep the other’s non-public business information confidential, use it only for the engagement, and share it only with people and contractors who need it and are bound by similar duties. This doesn’t apply to information that is public, already known, independently developed, or that must be disclosed by law.',
          ],
        },
        {
          heading: 'Client data',
          body: [
            'When we process personal data about your customers or audiences on your behalf, we act as your service provider (or “processor”) under our Data Processing Addendum, which forms part of these Terms.',
          ],
        },
        {
          heading: 'Ending an engagement',
          body: [
            'You can cancel a subscription as described above. Project engagements under an SOW end as the SOW states. Either of us may end an engagement if the other materially breaches these Terms and doesn’t fix it within 15 days of written notice.',
            'When an engagement ends, you pay for Services provided through the end date, and we’ll hand over completed, paid-for deliverables and return or delete your data as described in our Data Processing Addendum. Sections that by their nature should survive (payment, IP, confidentiality, disclaimers, liability and disputes) survive.',
          ],
        },
        {
          heading: 'Disclaimers',
          body: [
            'EXCEPT AS EXPRESSLY STATED IN THESE TERMS OR AN SOW, THE SITE AND SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE,” WITHOUT WARRANTIES OF ANY KIND, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT, TO THE EXTENT THE LAW ALLOWS. We will perform the Services with reasonable skill and care, consistent with industry standards.',
          ],
        },
        {
          heading: 'Limitation of liability',
          body: [
            'TO THE EXTENT THE LAW ALLOWS, NEITHER PARTY IS LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE OR DATA, EVEN IF ADVISED THEY WERE POSSIBLE.',
            'OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SITE OR SERVICES IS LIMITED TO THE FEES YOU PAID US (EXCLUDING AD SPEND AND THIRD-PARTY COSTS) IN THE THREE MONTHS BEFORE THE EVENT THAT GAVE RISE TO THE CLAIM.',
            'These limits don’t apply to your payment obligations, either party’s indemnity obligations, or liability that can’t be limited by law.',
          ],
        },
        {
          heading: 'Indemnity',
          body: [
            'You will defend and indemnify Hewn Life against third-party claims arising from materials or data you provide, your products and services, claims you approve for your marketing, or your breach of law or these Terms. We will defend and indemnify you against third-party claims that deliverables we created (excluding your materials and third-party materials) infringe that party’s intellectual property rights.',
          ],
        },
        {
          heading: 'Disputes and governing law',
          body: [
            'If you have a concern, email hello@hewn.life first. Most things can be sorted out quickly, and we’ll try in good faith for 30 days before either of us goes further.',
            'These Terms are governed by the laws of the State of Utah, without regard to its conflict-of-laws rules. Any dispute will be decided exclusively by the state or federal courts located in Davis County, Utah, and both of us consent to their jurisdiction. Either of us may instead bring an eligible claim in small-claims court.',
          ],
        },
        {
          heading: 'General',
          body: [
            'We are an independent contractor. If any part of these Terms is unenforceable, the rest still applies. Not enforcing a provision isn’t a waiver. You may not assign these Terms without our consent; we may assign them as part of a merger, acquisition or sale of our business. We aren’t liable for delays caused by events beyond our reasonable control. These Terms, the policies they reference and any SOW are the entire agreement between us about their subject.',
            'We may send you notices by email to the address you gave us. You can send notices to hello@hewn.life or to Hewn Holdings LLC, 285 N Main St #115, Kaysville, UT 84037.',
          ],
        },
      ]}
    />
  )
}
