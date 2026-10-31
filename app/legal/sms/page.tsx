import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'SMS Terms — Hewn Life',
  description: 'How Hewn Life’s project text alerts work: what we send, how often, how to opt in and how to stop.',
}

export default function SmsTerms() {
  return (
    <LegalLayout
      title="SMS Terms"
      updated="October 31, 2026"
      intro="These terms cover Hewn Life Project Alerts, the text messages we send to clients about their projects. They’re part of our Terms of Service. Hewn Life is a trade name of Hewn Holdings LLC."
      summary={[
        'Texts are only for clients who turn them on in their client portal. We never sign you up for you.',
        'We text when something needs you or a step is done. Frequency varies with your project.',
        'Reply STOP to stop and HELP for help. Message and data rates may apply.',
        'Our texts never ask for payment, passwords or codes. If one does, it isn’t from us.',
      ]}
      sections={[
        {
          heading: 'What we send',
          body: ['Hewn Life Project Alerts are service messages about work we’re doing for you, such as:'],
          list: [
            'A step in your onboarding is done, or it’s your turn for the next one.',
            'A file, page, ad or post is ready for your review, or has gone live.',
            'A new message or project update from our team is waiting in your portal.',
          ],
        },
        {
          heading: 'How you opt in',
          body: [
            'Sign in to your client portal at hewn.life/portal, enter your mobile number under “Text alerts”, tick the consent box and choose “Turn on texts”. The box is never pre-ticked, and agreeing to texts is not a condition of buying anything from us. We send one confirmation text when you opt in, and we keep a record of when and how you agreed.',
          ],
        },
        {
          heading: 'How often',
          body: ['Message frequency varies with your project, typically a few texts a week while your project is active and fewer afterwards. Message and data rates may apply, according to your mobile plan.'],
        },
        {
          heading: 'How to stop',
          body: [
            'Reply STOP to any text, or choose “Turn texts off” in your portal. We’ll send one message confirming you’ve opted out and nothing after that. You’ll still receive emails about your project. To start again, reply START or turn texts back on in your portal.',
          ],
        },
        {
          heading: 'Help',
          body: ['Reply HELP to any text, or email hello@hewn.life. Replies to our texts that aren’t STOP, START or HELP are added to your portal messages so our team sees them.'],
        },
        {
          heading: 'Scams and impersonation',
          body: [
            'All of our texts come from one Hewn Life number and start with “Hewn Life:”. They only tell you what happened and point you to your portal. We will never text you asking you to buy gift cards, send money, pay an invoice, change bank details, or share a password or verification code. If you get a message like that claiming to be from us or anyone on our team, don’t reply, and let us know at hello@hewn.life.',
          ],
        },
        {
          heading: 'Carriers and privacy',
          body: [
            'Carriers are not liable for delayed or undelivered messages. We send texts through Twilio. We don’t sell or share your mobile number or your consent with third parties or affiliates for their marketing. See our Privacy Policy for how we handle your information.',
          ],
        },
        {
          heading: 'Contact',
          body: ['Hewn Holdings LLC, doing business as Hewn Life, 285 N Main St #115, Kaysville, UT 84037 · hello@hewn.life'],
        },
      ]}
    />
  )
}
