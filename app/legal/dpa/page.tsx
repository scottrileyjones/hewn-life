import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Data Processing Addendum — Hewn Life',
  description: 'How Hewn Life processes personal data about our clients’ customers and audiences on their behalf.',
}

export default function Dpa() {
  return (
    <LegalLayout
      title="Data Processing Addendum"
      updated="October 29, 2026"
      intro="This Data Processing Addendum (“DPA”) forms part of the Terms of Service between Hewn Life LLC (“Hewn Life”) and each client (“Client”). It applies when Hewn Life processes personal data about Client’s customers, leads, subscribers or audiences (“Client Personal Data”) on Client’s behalf while providing the Services. If you need a countersigned copy, email hello@hewn.life."
      summary={[
        'When we handle your customers’ data, you’re in charge of it and we only use it to do the work you’ve hired us for.',
        'We never sell it, keep it confidential, secure it, and only use vetted sub-processors.',
        'We help you answer privacy requests and tell you promptly about any breach.',
        'When we stop working together, we return or delete it.',
      ]}
      sections={[
        {
          heading: 'Roles',
          body: [
            'For Client Personal Data, Client is the controller (or “business”) and Hewn Life is the processor (or “service provider” or “contractor”) under applicable data protection laws, including US state privacy laws such as the California Consumer Privacy Act, and the GDPR and UK GDPR where they apply.',
          ],
        },
        {
          heading: 'Instructions and purpose',
          body: [
            'Hewn Life will process Client Personal Data only to provide the Services described in the Terms, the plan Client purchased or an SOW, and on Client’s documented instructions, which include those agreements and Client’s use of the Services. Hewn Life will tell Client if it believes an instruction violates law.',
            'Types of data typically include contact details, account and purchase history, website and advertising interaction data, and audience lists. Data subjects are Client’s customers, prospects, subscribers and website visitors. Processing lasts for the term of the engagement.',
          ],
        },
        {
          heading: 'Service-provider commitments',
          body: ['Hewn Life will not:'],
          list: [
            'Sell or share Client Personal Data, as those terms are defined in US state privacy laws.',
            'Retain, use or disclose it for any purpose other than providing the Services, or outside the direct business relationship with Client.',
            'Combine it with personal data from other sources, except as permitted by law to perform the Services.',
            'Use it to train AI models.',
          ],
        },
        {
          heading: 'Client responsibilities',
          body: [
            'Client is responsible for having a lawful basis, notices and any consents required to collect Client Personal Data and to have Hewn Life process it, including consent for email marketing and for uploading audiences to advertising platforms. Client will not provide protected health information unless the parties have signed a Business Associate Agreement.',
          ],
        },
        {
          heading: 'Confidentiality and security',
          body: [
            'Hewn Life will ensure people who process Client Personal Data are bound by confidentiality, and will use appropriate technical and organizational measures to protect it, including access limited to those who need it, multi-factor authentication on systems that hold it, encryption in transit, and reputable hosting providers.',
          ],
        },
        {
          heading: 'Sub-processors',
          body: [
            'Client authorizes Hewn Life to use sub-processors, including the service providers listed in our Privacy Policy and the advertising, analytics and email platforms Client asks us to use. Hewn Life will bind sub-processors to data protection terms at least as protective as this DPA and remains responsible for them. We’ll give Client notice of a new sub-processor that will process Client Personal Data, and Client may object on reasonable data protection grounds.',
          ],
        },
        {
          heading: 'Data subject requests',
          body: [
            'Hewn Life will promptly forward to Client any request it receives from a data subject about Client Personal Data, and will help Client respond to requests to access, correct, delete or opt out, to the extent Hewn Life holds the data.',
          ],
        },
        {
          heading: 'Security incidents',
          body: [
            'Hewn Life will notify Client without undue delay, and within 72 hours where feasible, after becoming aware of a breach of security affecting Client Personal Data, and will provide the information Client reasonably needs to meet its own notification obligations.',
          ],
        },
        {
          heading: 'Assistance and audits',
          body: [
            'Hewn Life will provide information reasonably necessary to show compliance with this DPA, and will reasonably assist Client with data protection assessments. Client may audit compliance no more than once a year, on reasonable notice and at its own cost, by written questionnaire or, if that isn’t sufficient, by an independent auditor under confidentiality.',
          ],
        },
        {
          heading: 'International transfers',
          body: [
            'Hewn Life and its main sub-processors process data in the United States. Where the GDPR or UK GDPR applies to a transfer, the parties agree to the European Commission’s Standard Contractual Clauses (Module 2, controller to processor) and the UK Addendum, which are incorporated by reference.',
          ],
        },
        {
          heading: 'Return and deletion',
          body: [
            'When the Services end, Hewn Life will, at Client’s choice, return or delete Client Personal Data within 30 days, except where the law requires us to keep it. Data in backups is deleted on the normal backup cycle and kept confidential until then.',
          ],
        },
        {
          heading: 'Precedence',
          body: [
            'If this DPA conflicts with the Terms or an SOW about the processing of Client Personal Data, this DPA controls. The limitation of liability in the Terms applies to this DPA.',
          ],
        },
      ]}
    />
  )
}
