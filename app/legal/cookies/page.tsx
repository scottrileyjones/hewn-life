import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Cookie Policy — Hewn Life',
  description: 'How Hewn Life uses cookies and similar tracking technologies.',
}

export default function Cookies() {
  return (
    <LegalLayout
      title="Cookie Policy"
      updated="May 30, 2026"
      intro="This Cookie Policy explains how Hewn Life LLC uses cookies and similar technologies when you visit our website. It should be read alongside our Privacy Policy. By continuing to use our website, you consent to our use of cookies as described here, subject to your choices below."
      sections={[
        {
          heading: 'What Are Cookies',
          body: [
            'Cookies are small text files placed on your device when you visit a website. They help the site function, remember your preferences, and provide information to the site owner. We also use similar technologies such as pixels, tags, and local storage, which we refer to collectively as &ldquo;cookies&rdquo; in this Policy.',
          ],
        },
        {
          heading: 'Types of Cookies We Use',
          body: ['We use the following categories of cookies:'],
          list: [
            'Strictly necessary — required for the website to function and cannot be switched off.',
            'Performance & analytics — help us understand how visitors use the site so we can improve it (e.g., analytics tools).',
            'Functional — remember your preferences and choices to personalize your experience.',
            'Advertising & targeting — used by us and our partners to deliver and measure relevant marketing across platforms.',
          ],
        },
        {
          heading: 'Third-Party Cookies',
          body: [
            'Some cookies are set by third parties that provide services to us, such as analytics and advertising platforms (for example, Google and Meta). These third parties may use cookies to collect information about your activity across websites and over time. We do not control these third-party cookies; please review the relevant provider&apos;s policies for details.',
          ],
        },
        {
          heading: 'Your Cookie Choices',
          body: [
            'You can control and delete cookies through your browser settings, and you can usually set your browser to refuse cookies or alert you when cookies are being sent. Disabling certain cookies may affect the functionality of the website. You may also opt out of certain advertising cookies through industry tools provided by the Digital Advertising Alliance and the Network Advertising Initiative.',
          ],
        },
        {
          heading: 'Do Not Track',
          body: [
            'Some browsers offer a &ldquo;Do Not Track&rdquo; signal. Because there is no consistent industry standard for responding to these signals, our website does not currently respond to them differently.',
          ],
        },
        {
          heading: 'Changes to This Policy',
          body: [
            'We may update this Cookie Policy from time to time to reflect changes in technology, law, or our practices. Material changes will be posted on this page with a revised &ldquo;Last updated&rdquo; date.',
          ],
        },
        {
          heading: 'Contact Us',
          body: [
            'If you have questions about our use of cookies, contact us at hello@hewnlife.com.',
          ],
        },
      ]}
    />
  )
}
