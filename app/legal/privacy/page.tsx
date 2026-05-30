import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Privacy Policy — Hewn Life',
  description: 'How Hewn Life collects, uses, and protects your personal information.',
}

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="May 30, 2026"
      intro="This Privacy Policy explains how Hewn Life (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, discloses, and safeguards your information when you visit our website, contact us, or use our services. By using our website or services, you consent to the practices described here."
      sections={[
        {
          heading: 'Information We Collect',
          body: ['We collect information in the following ways:'],
          list: [
            'Information you provide — name, email, phone number, company details, billing information, and anything you share when you contact us, book a call, or engage our services.',
            'Information collected automatically — IP address, browser type, device information, pages viewed, referring URLs, and similar usage data collected through cookies and analytics tools.',
            'Information from clients&apos; accounts — where you engage us to manage advertising, websites, or analytics, we may access data within the accounts and platforms you authorize.',
            'Information from third parties — analytics, advertising, and service providers that help us operate our business.',
          ],
        },
        {
          heading: 'How We Use Your Information',
          body: ['We use the information we collect to:'],
          list: [
            'Provide, operate, maintain, and improve our services and website.',
            'Respond to inquiries, schedule calls, and communicate about engagements.',
            'Process payments and send invoices and service-related notices.',
            'Analyze usage, measure marketing performance, and develop new offerings.',
            'Comply with legal obligations and enforce our agreements.',
          ],
        },
        {
          heading: 'Legal Bases for Processing',
          body: [
            'Where applicable law requires a legal basis (such as the GDPR), we process personal data on the basis of your consent, the performance of a contract, our legitimate business interests, and compliance with legal obligations.',
          ],
        },
        {
          heading: 'Cookies & Tracking Technologies',
          body: [
            'We and our partners use cookies, pixels, and similar technologies to operate the site, remember preferences, and measure marketing performance. You can control cookies through your browser settings. For details, see our Cookie Policy.',
          ],
        },
        {
          heading: 'How We Share Information',
          body: ['We do not sell your personal information. We may share information with:'],
          list: [
            'Service providers and contractors who perform work on our behalf (e.g., hosting, payment processing, analytics, email).',
            'Advertising and analytics platforms used to deliver and measure campaigns.',
            'Professional advisors, such as lawyers and accountants, where necessary.',
            'Authorities or other parties when required by law, to protect our rights, or in connection with a business transfer.',
          ],
        },
        {
          heading: 'Data Retention',
          body: [
            'We retain personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce agreements. When information is no longer needed, we take reasonable steps to delete or anonymize it.',
          ],
        },
        {
          heading: 'Data Security',
          body: [
            'We implement reasonable administrative, technical, and physical safeguards designed to protect your information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
          ],
        },
        {
          heading: 'Your Rights & Choices',
          body: [
            'Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal information, to object to processing, to data portability, and to withdraw consent. Residents of certain jurisdictions (including the EU/UK under GDPR and California under the CCPA/CPRA) may have additional rights. To exercise any right, contact us at the email below. We will not discriminate against you for exercising your rights.',
          ],
        },
        {
          heading: 'Third-Party Links & Services',
          body: [
            'Our website and deliverables may link to or integrate third-party sites and services that we do not control. This Policy does not apply to those third parties, and we encourage you to review their privacy practices.',
          ],
        },
        {
          heading: 'Children&apos;s Privacy',
          body: [
            'Our services are not directed to children under 16, and we do not knowingly collect personal information from them. If you believe a child has provided us information, please contact us so we can delete it.',
          ],
        },
        {
          heading: 'International Transfers',
          body: [
            'We may process and store information in countries other than where you reside. Where required, we use appropriate safeguards for cross-border transfers of personal data.',
          ],
        },
        {
          heading: 'Changes to This Policy',
          body: [
            'We may update this Privacy Policy from time to time. Material changes will be posted on this page with a revised &ldquo;Last updated&rdquo; date. Your continued use of our website or services after changes take effect constitutes acceptance.',
          ],
        },
        {
          heading: 'Contact Us',
          body: [
            'If you have questions or requests regarding this Privacy Policy or your personal information, contact us at hello@hewnlife.com.',
          ],
        },
      ]}
    />
  )
}
