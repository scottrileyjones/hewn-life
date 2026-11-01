import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'SMS Terms — Hewn Life',
  description: 'How Hewn Life’s text messages work: project alerts and offers, how often, how to opt in and how to stop.',
}

export default function SmsTerms() {
  return (
    <LegalLayout
      title="SMS Terms"
      updated="November 1, 2026"
      intro="These terms cover the two kinds of text message Hewn Life sends: Project Alerts, for clients about their projects, and Hewn Life Offers, occasional marketing texts. Each has its own opt-in. They’re part of our Terms of Service. Hewn Life is a trade name of Hewn Holdings LLC."
      summary={[
        'We only text people who ticked a box agreeing to it. Project alerts and offers are separate boxes, and neither is required to buy from us.',
        'Project alerts tell clients when something needs them or a step is done. Offers are occasional news and promotions, never more than one a day.',
        'Reply STOP to stop and HELP for help. Message and data rates may apply.',
        'Our texts never ask for payment, passwords or codes. If one does, it isn’t from us.',
      ]}
      sections={[
        {
          heading: 'Project Alerts',
          body: ['Project Alerts are service messages to clients about work we’re doing for them, such as:'],
          list: [
            'A step in your onboarding is done, or it’s your turn for the next one.',
            'A file, page, ad or post is ready for your review, or has gone live.',
            'A new message or project update from our team is waiting in your portal.',
          ],
        },
        {
          heading: 'Hewn Life Offers (marketing texts)',
          body: ['If you opt in, we occasionally send recurring automated marketing texts: new services, limited offers and promo codes, events and marketing tips. We send no more than one marketing text a day, and only between 8am and 8pm in every US time zone.'],
        },
        {
          heading: 'How you opt in',
          body: [
            'Project Alerts: sign in to your client portal at hewn.life/portal, enter your mobile number under “Text alerts”, tick the consent box and choose “Turn on texts”.',
            'Hewn Life Offers: tick the optional “Text me offers and news from Hewn Life” box next to your phone number on our ROI calculator, contact form, website brief or client portal.',
            'The boxes are never pre-ticked, they’re separate from our email consent, and agreeing to texts is not a condition of buying anything from us. We send one confirmation text when you opt in, and we keep a record of when, where and how you agreed.',
          ],
        },
        {
          heading: 'How often',
          body: ['Message frequency varies. Project alerts follow your project, typically a few texts a week while it’s active and fewer afterwards. Offers are occasional. Message and data rates may apply, according to your mobile plan.'],
        },
        {
          heading: 'How to stop',
          body: [
            'Reply STOP to any text. That stops all texts from our number, alerts and offers alike. We’ll send one message confirming you’ve opted out and nothing after that. Clients can also choose “Turn texts off” in their portal. You’ll still receive emails about your project. To start again, reply START or turn texts back on in your portal.',
          ],
        },
        {
          heading: 'Help',
          body: ['Reply HELP to any text, or email hello@hewn.life. Other replies go to our team: from clients they’re added to your portal messages; from anyone else they’re emailed to us.'],
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
            'Carriers are not liable for delayed or undelivered messages. We send texts through Twilio. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging opt-in data and consent will not be shared with any third parties, except the providers that deliver our messages (Twilio). See our Privacy Policy for how we handle your information.',
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
