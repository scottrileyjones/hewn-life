import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Terms of Service — Hewn Life',
  description: 'The terms and conditions governing the use of Hewn Life services.',
}

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="May 30, 2026"
      intro="These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the websites, products, and services (collectively, the &ldquo;Services&rdquo;) provided by Hewn Life LLC, a Utah limited liability company (&ldquo;Hewn Life,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By engaging our Services, signing a statement of work, or using this website, you (&ldquo;Client,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) agree to be bound by these Terms. If you do not agree, do not use the Services."
      sections={[
        {
          heading: 'Acceptance of Terms',
          body: [
            'By accessing our website, engaging us for a project, or executing a proposal, statement of work, or order form (each, an &ldquo;SOW&rdquo;), you accept these Terms in full. Where a signed SOW conflicts with these Terms, the SOW controls for that engagement.',
            'We may update these Terms from time to time. Material changes will be posted on this page with a revised &ldquo;Last updated&rdquo; date. Continued use of the Services after changes take effect constitutes acceptance.',
          ],
        },
        {
          heading: 'Scope of Services',
          body: [
            'Hewn Life provides marketing, advertising, branding, web design and development, content production, and related strategic and creative services. The specific deliverables, timelines, fees, and responsibilities for each engagement are set out in the applicable SOW.',
            'Any services, deliverables, channels, or platforms not expressly described in an SOW are outside the scope of that engagement. Additional work may be quoted separately as a change order.',
          ],
        },
        {
          heading: 'Client Responsibilities',
          body: ['You agree to cooperate in good faith and to provide what we reasonably need to perform the Services, including:'],
          list: [
            'Timely access to accounts, assets, brand materials, logins, and personnel.',
            'Accurate and complete information, approvals, and feedback within agreed timeframes.',
            'All necessary rights, licenses, and permissions for any materials you provide to us.',
            'Compliance with all applicable laws and the policies of third-party platforms (e.g., Google, Meta, payment processors).',
          ],
        },
        {
          heading: 'Fees, Invoicing & Payment',
          body: [
            'Fees are set out in the applicable SOW. Unless otherwise stated, project fees and the first month of any recurring engagement are due before work begins. Recurring fees are billed in advance and are non-refundable except as stated in our Refund Policy.',
            'Invoices are due upon receipt unless otherwise specified. Late payments may accrue interest at the lesser of 1.5% per month or the maximum permitted by law, and we may suspend Services until outstanding amounts are paid. You are responsible for all taxes other than taxes on our net income.',
            'Third-party costs — including advertising spend (&ldquo;ad spend&rdquo;), media buys, software, subscriptions, stock assets, and hosting — are your responsibility and are billed at cost or paid directly by you, separate from our service fees.',
          ],
        },
        {
          heading: 'Advertising Spend & Third-Party Platforms',
          body: [
            'Where we manage advertising on your behalf, you authorize us to operate the relevant ad accounts and to allocate the budget you approve. You acknowledge that ad performance depends on numerous factors outside our control, including platform algorithms, auction dynamics, competition, market conditions, and platform policy enforcement.',
            'We do not guarantee any specific advertising result, ranking, impression, click, lead, conversion, sale, or return on ad spend. Platforms may suspend, disable, or reject accounts, campaigns, or creative for reasons outside our control, and we are not liable for such actions.',
          ],
        },
        {
          heading: 'No Guarantee of Results',
          body: [
            'Marketing and advertising outcomes are inherently uncertain. Any forecasts, projections, benchmarks, case studies, or examples we provide are illustrative only and are not promises or guarantees of future performance. You are responsible for your own business decisions and results.',
          ],
        },
        {
          heading: 'Intellectual Property',
          body: [
            'Upon full payment of all applicable fees, you will own the final deliverables created specifically for you under an SOW, excluding any third-party materials and our pre-existing or proprietary tools, frameworks, templates, code libraries, and know-how (&ldquo;Hewn Life Materials&rdquo;), which remain our property.',
            'We grant you a non-exclusive, perpetual license to use Hewn Life Materials solely as incorporated into your deliverables. Until full payment is received, all deliverables remain our property. You retain ownership of materials you provide to us and grant us a license to use them for the engagement.',
            'Unless you opt out in writing, we may display non-confidential deliverables and describe the work in our portfolio, case studies, and marketing.',
          ],
        },
        {
          heading: 'Confidentiality',
          body: [
            'Each party may receive confidential information from the other. Both parties agree to protect such information, to use it only to perform under the engagement, and not to disclose it to third parties except to personnel or contractors who need it and are bound by similar obligations. This section does not apply to information that is public, independently developed, or lawfully obtained from another source.',
          ],
        },
        {
          heading: 'Term & Termination',
          body: [
            'Engagements continue for the term stated in the SOW. Either party may terminate for material breach if the breach is not cured within fifteen (15) days of written notice. Recurring engagements may be terminated by either party with thirty (30) days&apos; written notice unless the SOW states otherwise.',
            'Upon termination, you must pay for all Services performed and costs incurred through the effective date of termination. Sections relating to payment, intellectual property, confidentiality, disclaimers, limitation of liability, and indemnification survive termination.',
          ],
        },
        {
          heading: 'Disclaimers',
          body: [
            'THE SERVICES AND ALL DELIVERABLES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE,&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. We do not warrant that the Services will be uninterrupted, error-free, or that any particular result will be achieved.',
          ],
        },
        {
          heading: 'Limitation of Liability',
          body: [
            'TO THE MAXIMUM EXTENT PERMITTED BY LAW, HEWN LIFE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATING TO THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.',
            'OUR TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THE SERVICES WILL NOT EXCEED THE AMOUNT OF FEES YOU PAID TO US (EXCLUDING AD SPEND AND THIRD-PARTY COSTS) IN THE THREE (3) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.',
          ],
        },
        {
          heading: 'Indemnification',
          body: [
            'You agree to defend, indemnify, and hold harmless Hewn Life and its owners, employees, and contractors from any claims, damages, liabilities, costs, and expenses (including reasonable legal fees) arising from materials you provide, your products or services, your use of deliverables, your violation of law or third-party rights, or your breach of these Terms.',
          ],
        },
        {
          heading: 'Independent Contractor',
          body: [
            'Hewn Life is an independent contractor. Nothing in these Terms creates an employment, partnership, joint venture, or agency relationship between the parties beyond the limited authority expressly granted in an SOW.',
          ],
        },
        {
          heading: 'Governing Law & Dispute Resolution',
          body: [
            'These Terms are governed by the laws of the State of Utah, without regard to conflict-of-laws principles. The parties will attempt to resolve disputes informally and in good faith. Any unresolved dispute will be subject to binding arbitration or the exclusive jurisdiction of the state and federal courts located in Davis County, Utah, and the parties consent to the personal jurisdiction of those courts.',
          ],
        },
        {
          heading: 'General',
          body: [
            'If any provision is held unenforceable, the remaining provisions remain in effect. Our failure to enforce a provision is not a waiver. You may not assign these Terms without our consent; we may assign them in connection with a merger, acquisition, or sale of assets. These Terms, together with any applicable SOW, constitute the entire agreement between the parties.',
          ],
        },
      ]}
    />
  )
}
