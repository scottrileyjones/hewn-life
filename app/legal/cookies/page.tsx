import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Cookie Policy — Hewn Life',
  description: 'The cookies and similar technologies on hewn.life, what they do, and how to change your choice.',
}

export default function Cookies() {
  return (
    <LegalLayout
      title="Cookie Policy"
      updated="October 29, 2026"
      intro="This Cookie Policy explains how Hewn Life LLC uses cookies and similar technologies (such as tags, pixels and local storage, together “cookies”) on hewn.life. It should be read with our Privacy Policy."
      summary={[
        'Analytics and advertising cookies stay off until you click Accept in our banner.',
        'If you decline, only what the Site needs to work is used.',
        'You can change your mind any time with “Cookie settings” in the site footer.',
        'If your browser sends Global Privacy Control, advertising cookies stay off even if you accept.',
      ]}
      sections={[
        {
          heading: 'What cookies are',
          body: [
            'Cookies are small files a website stores in your browser. They let a site work properly, remember your choices and, with your permission, understand how people use it and measure advertising.',
          ],
        },
        {
          heading: 'Cookies we use',
          body: ['We group them into four categories:'],
          list: [
            'Strictly necessary — keep the Site secure and working, and remember your cookie choice (stored in your browser as “hewn-cookie-consent”). Always on.',
            'Functional — remember things like whether you’ve dismissed our ROI calculator prompt. Stored in your browser only.',
            'Analytics — Google Analytics, loaded through Google Tag Manager, tells us which pages are visited and how people move through the Site. Off until you accept.',
            'Advertising — Google Ads and other advertising platforms we may use, loaded through Google Tag Manager, measure which ads lead to inquiries and purchases and may personalize ads. Off until you accept, and off whenever your browser sends Global Privacy Control.',
          ],
        },
        {
          heading: 'How consent works on this site',
          body: [
            'We use Google Consent Mode. Until you accept, Google’s tags run in a restricted mode: they don’t read or write analytics or advertising cookies and send only limited, cookieless signals that Google uses for aggregate measurement. Accepting turns on analytics and advertising cookies; declining keeps them off.',
          ],
        },
        {
          heading: 'Third-party services',
          body: [
            'Some pages embed services that may set their own cookies when you use them: Stripe on our checkout page (for payment security and fraud prevention) and Cal.com when you book a call. These are needed to provide what you asked for, and their own cookie and privacy policies apply.',
          ],
        },
        {
          heading: 'Changing your choice',
          body: [
            'Click “Cookie settings” in the footer of any page to reopen the banner and choose again. You can also delete or block cookies in your browser settings, and opt out of interest-based advertising at optout.aboutads.info and optout.networkadvertising.org, or in your Google ad settings. Blocking strictly necessary cookies may stop parts of the Site from working.',
          ],
        },
        {
          heading: 'Global Privacy Control and Do Not Track',
          body: [
            'We treat a Global Privacy Control signal as a request to opt out of the sale or sharing of personal information for targeted advertising, and keep advertising cookies off for that browser. There’s no agreed standard for the older “Do Not Track” signal, so we don’t respond to it separately.',
          ],
        },
        {
          heading: 'Changes',
          body: [
            'If we add or change the cookies we use, we’ll update this page and its “Last updated” date. If the change needs your consent, we’ll ask again.',
          ],
        },
      ]}
    />
  )
}
