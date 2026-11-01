/**
 * Client agreements: one Master Services Agreement shared by every engagement,
 * plus an Order Form per product with that client's fees, term and scope.
 * `render(deal)` turns the order details into the exact text the client signs;
 * that text is frozen (and hashed) when the agreement is sent.
 *
 * Starter drafts for attorney review. Keep them consistent with /legal/terms,
 * /legal/refund and /legal/dpa.
 */

export const PRODUCTS = ['Website in a Day', 'Hewn', 'Wrought', 'Forged', 'Add-on services', 'Custom project'] as const
export type Product = typeof PRODUCTS[number]
export type Billing = 'monthly' | 'annual' | 'one-time'

export type AddOn = { name: string; detail: string; fee: number }

/** The add-on services on the pricing page, in the same order and at the same fees. */
export const ADD_ONS: AddOn[] = [
  { name: 'Extra Ad Creative Pack', detail: '8 additional ad creatives, static or motion, for any platform', fee: 800 },
  { name: 'Email Automation Build-Out', detail: 'A 6-email nurture or sales sequence, fully written and mapped', fee: 1500 },
  { name: 'Additional SEO Blog Post', detail: 'One post of 1,200–1,500 words, keyword-optimized and ready to publish', fee: 350 },
  { name: 'Video Repurposing Pack', detail: 'One raw video edited into 5 short-form clips, captioned and formatted', fee: 400 },
  { name: 'Whitepaper or Lead Magnet', detail: 'A long-form authority piece, researched, written and designed', fee: 1200 },
  { name: 'Competitor Audit + Report', detail: 'A positioning gap analysis with actionable recommendations', fee: 1800 },
  { name: 'Brand Identity Refresh', detail: 'Updated logo, colors and typography, delivered in a style guide', fee: 2500 },
  { name: 'Full Website Copy', detail: 'Five pages written, structured and optimized for conversion', fee: 3000 },
]

/** List prices; HQ can override the fee on any agreement (e.g. a beta price). */
export const LIST_PRICE: Record<Product, { monthly?: number; annual?: number; once?: number }> = {
  'Website in a Day': { once: 999 },
  Hewn: { monthly: 2500, annual: 2000 },
  Wrought: { monthly: 5000, annual: 4000 },
  Forged: { monthly: 9500, annual: 7600 },
  'Add-on services': {},
  'Custom project': {},
}
export const isRetainer = (p: Product) => p === 'Hewn' || p === 'Wrought' || p === 'Forged'

export type Deal = {
  product: Product
  /** The client's legal entity, e.g. "Acme Plumbing LLC". */
  clientLegalName: string
  /** e.g. "a Utah limited liability company". Optional. */
  clientEntity: string
  clientAddress: string
  signerName: string
  signerTitle: string
  signerEmail: string
  /** ISO dates. */
  effectiveDate: string
  startDate: string
  billing: Billing
  /** Per month for retainers, total for one-time work. */
  fee: number
  /** For retainers on Wrought/Forged: the client's planned monthly ad budget, for reference only. */
  adBudget: string
  addOns: { name: string; qty: number }[]
  /** Custom project only. */
  projectTitle: string
  scope: string
  deliverables: string
  schedule: string
  paymentTerms: string
  /** Anything specific to this client; printed under Special terms. */
  specialTerms: string
}

export type Section = { heading: string; paragraphs: string[]; list?: string[] }
export type Doc = { title: string; parties: string; sections: Section[] }

const usd = (n: number) => (n > 0 ? `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}` : '[fee]')
export const longDate = (iso: string) => (iso ? new Date(`${iso.slice(0, 10)}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '[date]')
const or = (s: string, fallback: string) => (s.trim() ? s.trim() : fallback)
const lines = (s: string) => s.split('\n').map(l => l.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)

export const HEWN = {
  legalName: 'Hewn Holdings LLC',
  dba: 'Hewn Life',
  entity: 'a Utah limited liability company',
  address: '285 N Main St #115, Kaysville, UT 84037',
  email: 'hello@hewn.life',
}

/* ── Master Services Agreement ─────────────────────────────── */

function msa(): Section[] {
  return [
    {
      heading: 'How this agreement works',
      paragraphs: [
        'This Master Services Agreement (the “MSA”) sets the terms for all marketing services Hewn Life provides to Client. The specific services, fees and term for an engagement are set out in an Order Form. This MSA and each Order Form signed under it together form the “Agreement.”',
        'If an Order Form conflicts with this MSA, the Order Form controls for that engagement only. For engagements under this Agreement, it replaces the Terms of Service on hewn.life, except that our Privacy Policy and Data Processing Addendum continue to apply as described below.',
      ],
    },
    {
      heading: 'Services',
      paragraphs: [
        'Hewn Life will provide the services and deliverables described in each Order Form (the “Services”) with reasonable skill and care, consistent with industry standards, using its own methods, tools and team, including vetted contractors who are bound by confidentiality and intellectual-property obligations at least as protective as this Agreement. Hewn Life remains responsible for their work.',
        'Anything not described in an Order Form is out of scope. Either party may request changes in writing (email is enough). Changes that affect fees, scope or timing take effect only once both parties agree to them in writing, which may be a new or amended Order Form.',
      ],
    },
    {
      heading: 'Client responsibilities',
      paragraphs: ['To let Hewn Life do its work, Client will:'],
      list: [
        'Give timely access to the accounts, assets, information, approvals and people Hewn Life reasonably needs, through the client portal where possible.',
        'Provide accurate information, and only materials Client has the right to use and to let Hewn Life use.',
        'Review and respond to work within 5 business days, or as an Order Form says. Delays on Client’s side may move delivery dates, and do not pause fees for retainers.',
        'Comply with the laws that apply to its business and marketing, and with the policies of the platforms used for it.',
        'Have a lawful basis, including any required consent, for customer data it asks Hewn Life to use, such as email lists, phone numbers or advertising audiences.',
      ],
    },
    {
      heading: 'Fees and payment',
      paragraphs: [
        'Client will pay the fees in each Order Form. Payments are processed by Stripe; card and bank details are held by Stripe, not Hewn Life. For retainers, Client authorizes Hewn Life to charge the saved payment method on each billing date until the engagement ends.',
        'Invoices are due on receipt unless an Order Form says otherwise. If a payment fails or is more than 10 days late, Hewn Life may pause the Services after giving notice until the balance is paid. Overdue amounts may accrue interest at 1.5% per month, or the highest rate allowed by law if lower.',
        'Fees exclude sales, use and similar taxes, which Client will pay where they apply. Hewn Life may change retainer fees for future billing periods with at least 30 days’ written notice; Client may cancel before the change takes effect.',
      ],
    },
    {
      heading: 'Advertising spend and third-party costs',
      paragraphs: [
        'Advertising spend, software subscriptions, domains, stock media, creator or influencer fees, printing and other third-party costs are separate from Hewn Life’s fees. Wherever possible, ad accounts and tools are set up in Client’s name and billed by the platform directly to Client. Hewn Life does not advance ad spend. Any third-party cost Hewn Life pays on Client’s behalf with Client’s prior written approval is billed at cost.',
        'Client authorizes Hewn Life to operate the advertising accounts it manages within the budgets Client approves. Platforms such as Google and Meta set their own rules and may reject ads, limit delivery or suspend accounts for reasons outside Hewn Life’s control. Hewn Life is not responsible for platform decisions, outages, policy changes or fees.',
      ],
    },
    {
      heading: 'No guaranteed results',
      paragraphs: [
        'Marketing results depend on many things neither party fully controls, including Client’s offer, pricing, market, competition, platform algorithms and how quickly recommendations are acted on. Hewn Life does not guarantee any ranking, traffic, lead volume, conversion rate, cost per acquisition, return on ad spend or revenue. Projections, benchmarks, scores, plans and case studies are estimates and illustrations, not promises.',
      ],
    },
    {
      heading: 'Marketing claims, reviews and regulated industries',
      paragraphs: [
        'Client is responsible for the truth and substantiation of the claims made about its products and services, and gives final approval of marketing before it is published. Where Client’s business is regulated (for example healthcare, financial services, legal, alcohol, cannabis or firearms), Client is responsible for confirming that marketing meets those regulations.',
        'Review, testimonial, creator and referral programs will follow the FTC’s Endorsement Guides and its rule on consumer reviews: no fake or incentivized-for-positive reviews, no review gating, and clear disclosure of material connections. Client will not ask Hewn Life to do otherwise.',
      ],
    },
    {
      heading: 'AI-assisted work',
      paragraphs: [
        'Hewn Life uses AI tools, including models provided by Anthropic, to help research, draft and produce some work. Everything delivered to Client is reviewed by Hewn Life’s team first. Hewn Life does not use Client’s confidential information to train AI models and only uses providers whose terms do not allow them to train on the data Hewn Life sends.',
      ],
    },
    {
      heading: 'Ownership and accounts',
      paragraphs: [
        'Once Client has paid the fees for them, Client owns the final deliverables Hewn Life creates specifically for Client, except (a) third-party materials such as licensed fonts, stock media and software, which stay subject to their own licenses, and (b) Hewn Life’s pre-existing and generally applicable tools, templates, frameworks, code, prompts and know-how (“Hewn Life Materials”). Hewn Life grants Client a perpetual, non-exclusive, royalty-free license to use Hewn Life Materials built into Client’s deliverables, for use with those deliverables.',
        'Client keeps ownership of everything it provides and grants Hewn Life a license to use it to perform the Services. Client’s domains, websites, ad accounts, analytics, social profiles and customer data belong to Client. Where Hewn Life sets one up, it does so in Client’s name or transfers it to Client when the engagement ends, once fees are paid.',
        'Unless Client says no in writing, Hewn Life may show non-confidential work in its portfolio and describe the engagement in general terms. Hewn Life will not name Client or publish Client’s results in a case study without Client’s written permission.',
      ],
    },
    {
      heading: 'Confidentiality',
      paragraphs: [
        'Each party will keep the other’s non-public business information confidential, use it only for this Agreement, and share it only with people who need it and are bound by similar duties. This does not apply to information that is or becomes public through no fault of the receiving party, was already known to it, is independently developed, or must be disclosed by law (with prompt notice where allowed). These duties last for the engagement and 3 years after it ends, and for trade secrets as long as they remain trade secrets.',
      ],
    },
    {
      heading: 'Data protection',
      paragraphs: [
        'When Hewn Life processes personal data about Client’s customers or audiences on Client’s behalf, it does so as Client’s service provider under the Data Processing Addendum at hewn.life/legal/dpa, which forms part of this Agreement. Hewn Life’s standard Services are not designed to receive protected health information under HIPAA; Client will not send any unless the parties have first signed a Business Associate Agreement.',
      ],
    },
    {
      heading: 'Term and ending an engagement',
      paragraphs: [
        'This MSA starts on the Effective Date and continues until every Order Form under it has ended. Each Order Form states its own term and how it renews or ends.',
        'Either party may end an Order Form, or this whole Agreement, by written notice if the other party materially breaches it and does not fix the breach within 15 days of written notice.',
        'When an engagement ends, Client pays for the Services provided and the fees committed through the end date; Hewn Life hands over completed, paid-for deliverables and account access in an orderly way within 15 business days, and returns or deletes Client data as the Data Processing Addendum describes. Sections that by their nature should continue (fees owed, ownership, confidentiality, data protection, disclaimers, liability, indemnities, non-solicitation and disputes) survive.',
      ],
    },
    {
      heading: 'Warranties and disclaimers',
      paragraphs: [
        'Each party confirms that it has authority to enter into this Agreement and that the person signing for it is authorized to do so.',
        'EXCEPT AS EXPRESSLY STATED IN THIS AGREEMENT, THE SERVICES AND DELIVERABLES ARE PROVIDED “AS IS,” AND EACH PARTY DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT, TO THE EXTENT THE LAW ALLOWS.',
      ],
    },
    {
      heading: 'Limitation of liability',
      paragraphs: [
        'TO THE EXTENT THE LAW ALLOWS, NEITHER PARTY IS LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, GOODWILL OR DATA, EVEN IF TOLD THEY WERE POSSIBLE.',
        'EACH PARTY’S TOTAL LIABILITY FOR ALL CLAIMS RELATING TO THIS AGREEMENT IS LIMITED TO THE FEES CLIENT PAID HEWN LIFE UNDER THE ORDER FORM GIVING RISE TO THE CLAIM IN THE 3 MONTHS BEFORE THE EVENT THAT CAUSED IT (OR, FOR ONE-TIME WORK, THE FEES PAID FOR THAT WORK), EXCLUDING AD SPEND AND THIRD-PARTY COSTS.',
        'These limits do not apply to Client’s payment obligations, either party’s indemnity obligations, breach of confidentiality, or liability that cannot be limited by law.',
      ],
    },
    {
      heading: 'Indemnities',
      paragraphs: [
        'Client will defend and indemnify Hewn Life against third-party claims arising from materials or data Client provides, Client’s products and services, marketing claims Client approves, or Client’s breach of law or this Agreement.',
        'Hewn Life will defend and indemnify Client against third-party claims that deliverables Hewn Life created (excluding Client materials, third-party materials and changes made by others) infringe that party’s intellectual-property rights.',
        'The party seeking indemnity will give prompt notice, reasonable cooperation, and control of the defense to the indemnifying party, which will not settle a claim in a way that admits fault for the other without its consent.',
      ],
    },
    {
      heading: 'Non-solicitation',
      paragraphs: [
        'During the engagement and for 12 months after it ends, neither party will directly solicit for employment or engagement any employee or contractor of the other who worked on the engagement, without the other’s written consent. General job postings not targeted at those people are allowed.',
      ],
    },
    {
      heading: 'Electronic signatures and notices',
      paragraphs: [
        'The parties agree to sign this Agreement and any Order Form electronically, and that an electronic signature has the same effect as a handwritten one under the federal ESIGN Act and the Utah Uniform Electronic Transactions Act. Each party may keep the signed PDF and its signature certificate as an original.',
        `Notices may be given by email to the addresses in the Order Form (for Hewn Life, ${HEWN.email}) or by mail to the addresses there. Notices of breach or termination should be sent by email with a copy by mail.`,
      ],
    },
    {
      heading: 'Disputes and governing law',
      paragraphs: [
        'If a dispute arises, the parties will first try in good faith to resolve it by talking for 30 days. This Agreement is governed by the laws of the State of Utah, without regard to its conflict-of-laws rules. Any dispute will be decided exclusively by the state or federal courts located in Davis County, Utah, and both parties consent to their jurisdiction. Either party may instead bring an eligible claim in small-claims court, or seek urgent injunctive relief in any competent court.',
      ],
    },
    {
      heading: 'General',
      paragraphs: [
        'The parties are independent contractors; nothing here creates a partnership, joint venture or employment relationship. Neither party may assign this Agreement without the other’s consent, except to a successor in a merger, acquisition or sale of substantially all of its business. Neither party is liable for delays caused by events beyond its reasonable control. If any part of this Agreement is unenforceable, the rest still applies. Not enforcing a provision is not a waiver. This Agreement, its Order Forms and the policies it refers to are the entire agreement between the parties about their subject and replace any earlier proposals or understandings. It can only be changed in writing signed by both parties, which may be electronic.',
      ],
    },
  ]
}

/* ── Order forms ───────────────────────────────────────────── */

const RETAINER_SCOPE: Record<'Hewn' | 'Wrought' | 'Forged', { pillars: string; groups: { name: string; items: string[] }[]; cadence: string[] }> = {
  Hewn: {
    pillars: 'Brand, Digital Presence (website, SEO + AI search), Social and Strategy',
    groups: [
      { name: 'Brand foundation', items: ['Brand strategy document (positioning, audience, voice)', 'Logo and visual identity (logo suite, palette, typography)', 'Brand style guide', 'Messaging framework (taglines, elevator pitch, value propositions)'] },
      { name: 'Digital presence', items: ['Website design and development, up to 5 pages, conversion-focused', 'SEO and AI-search foundation (technical and on-page)', 'Google Business Profile setup and optimization', 'Local listings management (consistent name, address and phone across directories)'] },
    ],
    cadence: ['A monthly strategy call', 'Requests and approvals through the client portal, with replies within one business day'],
  },
  Wrought: {
    pillars: 'everything in Hewn, plus Performance Media, AI Creative Production, Lifecycle / CRM and Data & Attribution',
    groups: [
      { name: 'Everything in Hewn', items: ['All Hewn deliverables'] },
      { name: 'Lead and revenue engine', items: ['Paid media management on Google and Meta', 'Sales funnel design (landing pages, offers, conversion paths)', 'Marketing automation (nurture sequences and drip campaigns)', 'CRM setup and integration (pipeline and sales process)'] },
      { name: 'Customer experience', items: ['Booking and scheduling system', 'Automated onboarding sequence for new customers', 'Retention campaigns (re-engagement and loyalty)', 'Customer feedback system (NPS and satisfaction)'] },
    ],
    cadence: ['A monthly strategy call', 'A live performance dashboard', 'Requests and approvals through the client portal, with replies within one business day'],
  },
  Forged: {
    pillars: 'All nine Hewn Life pillars',
    groups: [
      { name: 'Everything in Wrought', items: ['All Wrought deliverables'] },
      { name: 'Reputation and social proof', items: ['Review generation system (automated post-service requests)', 'UGC strategy and campaigns', 'Referral program with tracking', 'Testimonial collection (video and written)'] },
      { name: 'Business advisory', items: ['Monthly KPI dashboard', 'Monthly 60-minute performance and planning session', 'Quarterly growth planning with a written roadmap', 'Ongoing competitive intelligence'] },
    ],
    cadence: ['Weekly strategy calls', 'Slack access, Monday to Friday during business hours (Mountain Time)', 'Requests and approvals through the client portal'],
  },
}

function feeSection(d: Deal): Section {
  if (d.product === 'Add-on services') {
    const items = d.addOns.filter(a => a.qty > 0).map(a => {
      const def = ADD_ONS.find(x => x.name === a.name)
      return `${a.qty} × ${a.name}${def ? `: ${def.detail}` : ''} (${usd((def?.fee ?? 0) * a.qty)})`
    })
    return { heading: 'Services and fees', paragraphs: [`Total fee: ${usd(d.fee)}, payable in full before work starts.`], list: items.length ? items : ['[Add the services]'] }
  }
  if (isRetainer(d.product)) {
    const list = LIST_PRICE[d.product][d.billing === 'annual' ? 'annual' : 'monthly']
    const note = list && list !== d.fee ? ` (list price ${usd(list)} per month)` : ''
    return {
      heading: 'Fees',
      paragraphs: [
        d.billing === 'annual'
          ? `${usd(d.fee)} per month${note}, billed annually in advance as ${usd(d.fee * 12)} on the Start Date and on each anniversary.`
          : `${usd(d.fee)} per month${note}, billed monthly in advance on the Start Date and on the same day each month.`,
        'Fees exclude ad spend and third-party costs (see the MSA). Payment is by the card or bank account saved with Stripe at checkout.',
      ],
    }
  }
  if (d.product === 'Custom project') {
    return { heading: 'Fees and payment', paragraphs: [`Total fee: ${usd(d.fee)}.`, or(d.paymentTerms, '50% is due on signing and 50% on delivery. Each invoice is due on receipt.')] }
  }
  return { heading: 'Fee', paragraphs: [`${usd(d.fee)}, one-time${d.fee !== 999 ? ' (list price $999)' : ''}, payable in full before the build starts. Fees exclude ad spend and third-party costs.`] }
}

function termSection(d: Deal): Section {
  if (isRetainer(d.product)) {
    return {
      heading: 'Term, renewal and cancellation',
      paragraphs: d.billing === 'annual'
        ? [
            `The term starts on the Start Date and runs for 12 months, then renews for further 12-month terms unless Client cancels before the renewal date. Hewn Life will email a reminder at least 15 days before each renewal.`,
            'If Client cancels within 14 days of an annual charge, Hewn Life will refund the amount paid minus its regular monthly price for any month in which work has started. After that, annual fees are not refundable, but cancelling stops the next renewal.',
            'Client can cancel online at hewn.life/cancel or by emailing hello@hewn.life. There is no cancellation fee.',
          ]
        : [
            'Month to month, starting on the Start Date. There is no minimum term.',
            'Client can cancel at any time online at hewn.life/cancel or by emailing hello@hewn.life. Cancellation takes effect at the end of the month already paid for, and work continues until then. Because each month is planned and resourced at its start, a month that has started is not refundable. There is no cancellation fee.',
          ],
    }
  }
  if (d.product === 'Website in a Day') {
    return {
      heading: 'Delivery, edits and cancellation',
      paragraphs: [
        'The 24-hour delivery window starts once Hewn Life has both Client’s complete brief (including logo, photos and copy decisions, or Client’s instruction to write the copy) and cleared payment. If the brief is missing something needed, Hewn Life will say so, and the window starts when it is complete.',
        'After launch, Client has one round of edits, submitted in a single list within 14 days of the live link. Further edits, pages or features are quoted separately.',
        'Client may cancel for a full refund before the build starts. Once the build has started, the fee is not refundable. If something delivered does not match the brief, Hewn Life will fix it.',
      ],
    }
  }
  return {
    heading: 'Timing and cancellation',
    paragraphs: [
      d.product === 'Custom project' ? or(d.schedule, 'Work starts on the Start Date and the deliverables are delivered on the schedule agreed in writing.') : 'Work starts on the Start Date, or once any materials Hewn Life needs from Client have been received, and each item is usually delivered within 10 business days.',
      'Client may cancel before work starts for a full refund, less any third-party costs already incurred with Client’s approval. Once work has started, fees for completed work and work in progress are not refundable.',
      'Each item includes one round of revisions. The engagement ends when the deliverables are delivered and paid for.',
    ],
  }
}

function scopeSection(d: Deal): Section[] {
  if (isRetainer(d.product)) {
    const s = RETAINER_SCOPE[d.product as 'Hewn' | 'Wrought' | 'Forged']
    const out: Section[] = [
      { heading: 'Scope', paragraphs: [`The ${d.product} plan covers ${s.pillars}. Each month Hewn Life plans, produces and manages the work below, prioritized with Client in the strategy calls and tracked in the client portal.`] },
      ...s.groups.map(g => ({ heading: g.name, paragraphs: [], list: g.items })),
      { heading: 'How we work together', paragraphs: [], list: [...s.cadence, 'Onboarding within 48 hours of the Start Date'] },
    ]
    if (d.product !== 'Hewn') {
      out.push({
        heading: 'Advertising',
        paragraphs: [
          `Paid media runs in ad accounts owned by Client and is billed by the platforms directly to Client. ${d.adBudget.trim() ? `Client’s planned monthly ad budget is ${d.adBudget.trim()}. ` : ''}Hewn Life will not change the approved budget without Client’s written approval (email or portal message is enough).`,
          ...(d.product === 'Forged' ? ['Creator, influencer and referral-reward payments are third-party costs paid by Client and are not included in the fee.'] : []),
        ],
      })
    }
    return out
  }
  if (d.product === 'Website in a Day') {
    return [{
      heading: 'Scope',
      paragraphs: ['A custom website for Client, designed, written, built and launched by Hewn Life from Client’s brief:'],
      list: [
        'A home page plus the core pages the brief calls for (such as services, about and contact), built around one primary action',
        'Copy written from Client’s answers, or Client’s own copy, as Client chooses in the brief',
        'Mobile-friendly, fast, SEO-ready build with basic on-page optimization',
        'Contact or booking form connected to Client’s email or booking tool',
        'Connection to Client’s domain and launch, with the live link delivered within 24 hours (see below)',
        'Setup of the site’s code repository and hosting in accounts owned by Client (see Hosting and access below)',
        'One round of edits after launch',
      ],
    }, {
      heading: 'Hosting and access',
      paragraphs: [
        'Hewn Life does not host the site. The site’s code is kept in a code repository (such as GitHub) and published through a hosting provider (such as Vercel, Netlify or Cloudflare Pages), both in accounts owned by Client. Where Hewn Life creates them during the build, it transfers ownership to Client at launch. Hewn Life will recommend a plan with no hosting fee where one suits the site.',
        'Client gives Hewn Life collaborator access to the repository and the hosting project so Hewn Life, and the AI tools it uses, can make the edits included above and any changes Client asks for later. Client can remove that access at any time; Hewn Life will not change the site except as Client asks or approves.',
      ],
    }, {
      heading: 'Not included',
      paragraphs: [],
      list: [
        'The domain name itself and any paid third-party tools, plugins or stock media Client chooses',
        'E-commerce catalogs, logins, custom software, integrations beyond a form or booking link, and ongoing content updates',
        'Hosting itself: Client’s hosting account is Client’s, and any fees the hosting provider charges are paid by Client directly',
        'Ongoing content updates and marketing (available as monthly plans)',
      ],
    }]
  }
  if (d.product === 'Custom project') {
    return [
      { heading: or(d.projectTitle, 'Project'), paragraphs: lines(or(d.scope, '[Describe the project]')) },
      { heading: 'Deliverables', paragraphs: [], list: lines(or(d.deliverables, '[List the deliverables]')) },
    ]
  }
  return []
}

/** The complete agreement for a deal: MSA, then the Order Form. */
export function render(d: Deal): Doc {
  const client = `${or(d.clientLegalName, '[Client legal name]')}${d.clientEntity.trim() ? `, ${d.clientEntity.trim()}` : ''}`
  const orderHeader: Section = {
    heading: `Order Form: ${d.product === 'Custom project' ? or(d.projectTitle, 'Custom project') : d.product}`,
    paragraphs: [
      'This Order Form is issued under, and governed by, the Master Services Agreement in this document.',
    ],
    list: [
      `Client: ${client}`,
      `Client address: ${or(d.clientAddress, '[address]')}`,
      `Client contact for notices: ${or(d.signerName, '[name]')}, ${or(d.signerEmail, '[email]')}`,
      `Effective Date: ${longDate(d.effectiveDate)}`,
      `Start Date: ${longDate(d.startDate)}`,
      `Service: ${d.product}${isRetainer(d.product) ? ` retainer, billed ${d.billing === 'annual' ? 'annually' : 'monthly'}` : ''}`,
    ],
  }
  const special = d.specialTerms.trim()
    ? [{ heading: 'Special terms', paragraphs: lines(d.specialTerms) }]
    : []
  return {
    title: 'Master Services Agreement and Order Form',
    parties: `This Agreement is between ${HEWN.legalName}, ${HEWN.entity} doing business as ${HEWN.dba} (“Hewn Life”), ${HEWN.address}, and ${client} (“Client”), and is effective on ${longDate(d.effectiveDate)} (the “Effective Date”).`,
    sections: [
      ...msa().map((s, i) => ({ ...s, heading: `${i + 1}. ${s.heading}` })),
      orderHeader,
      ...scopeSection(d),
      feeSection(d),
      termSection(d),
      ...special,
    ],
  }
}

/** A sensible starting deal for a product, for the HQ form. */
export function blankDeal(product: Product, client: { company?: string; name?: string; email?: string } = {}): Deal {
  const today = new Date().toISOString().slice(0, 10)
  const price = LIST_PRICE[product]
  return {
    product,
    clientLegalName: client.company ?? '', clientEntity: '', clientAddress: '',
    signerName: client.name ?? '', signerTitle: 'Owner', signerEmail: client.email ?? '',
    effectiveDate: today, startDate: today,
    billing: isRetainer(product) ? 'monthly' : 'one-time',
    fee: price.monthly ?? price.once ?? 0,
    adBudget: '', addOns: [], projectTitle: '', scope: '', deliverables: '', schedule: '', paymentTerms: '',
    specialTerms: '',
  }
}

/** Total for an add-on order. */
export const addOnTotal = (items: Deal['addOns']) => items.reduce((sum, a) => sum + (ADD_ONS.find(x => x.name === a.name)?.fee ?? 0) * a.qty, 0)

/** Plain text of a document, used for the hash and the PDF. */
export function docText(doc: Doc): string {
  return [doc.title, doc.parties, ...doc.sections.flatMap(s => [s.heading, ...s.paragraphs, ...(s.list ?? []).map(l => `• ${l}`)])].join('\n\n')
}
