/** A made-up client and thread for previewing the portal locally (PLAN_SAMPLE=1 only). */
import type { PortalClient, PortalMessage } from './data'
import type { Asset } from './assets'

const ago = (days: number) => new Date(Date.now() - days * 864e5).toISOString()

export const sampleClient = (): PortalClient => ({
  id: 'sample', email: 'jane@acmeplumbing.com', name: 'Jane Smith', company: 'Acme Plumbing', plan: 'Website in a Day',
  status: 'Active',
  projectStatus: 'Thanks for the brief and the look you want, it’s a great start. Your logo is in; send your copy and domain and we start building.',
  nextSteps: 'Send the two new team photos for the About page\nApprove the edited services copy\nWe connect Google Search Console and send your first report',
  links: [
    { label: 'Your website', url: 'https://acmeplumbing.com/' },
    { label: 'Shared folder', url: 'https://drive.google.com/' },
  ],
  lastClientMessage: ago(1), lastTeamMessage: ago(0.2), lastLogin: ago(0.1),
  package: 'website-in-a-day',
  progress: {
    order: { done: ago(3), by: 'scott@hewn.life' },
    welcome: { done: ago(3), by: 'scott@hewn.life' },
    business: { submitted: ago(2.5), done: ago(2.4), by: 'jason@hewn.life', data: { business_name: 'Acme Plumbing', offers: 'Emergency repairs, water heaters, drain cleaning', ideal_customer: 'Homeowners in Davis County with an urgent problem', usp: 'On site within 2 hours, flat-rate pricing', primary_action: 'Call us' } },
    look: { submitted: ago(2.4), done: ago(2), by: 'jason@hewn.life', data: { reference_1: 'https://example.com', reference_notes: 'Clean, lots of white space, big phone number' } },
    assets: { submitted: ago(1), data: { folder: 'https://drive.google.com/', asset_notes: 'Use the van photo up top' }, files: ['assets--logo.png'] },
  },
  assets: [{ id: 'att1', name: 'assets--logo.png', url: 'https://example.com/logo.png', type: 'image/png', size: 48211 }],
})

export const sampleMessages = (): PortalMessage[] => [
  { id: 'm1', clientEmail: 'jane@acmeplumbing.com', from: 'Hewn', kind: 'Update', author: 'scott@hewn.life', at: ago(3), body: 'Kickoff done. We have your brief, logo and photos, and the build starts tomorrow morning.' },
  { id: 'm2', clientEmail: 'jane@acmeplumbing.com', from: 'Hewn', kind: 'Update', author: 'jason@hewn.life', at: ago(2), body: 'Your site is live at acmeplumbing.com. Have a look on your phone and tell us anything you’d change.' },
  { id: 'm3', clientEmail: 'jane@acmeplumbing.com', from: 'Client', kind: 'Message', author: 'jane@acmeplumbing.com', at: ago(1), body: 'Looks great! Can we add the two new guys to the About page? I’ll send photos this week.' },
  { id: 'm4', clientEmail: 'jane@acmeplumbing.com', from: 'Hewn', kind: 'Message', author: 'jason@hewn.life', at: ago(0.2), body: 'Absolutely. Drop the photos in the shared folder and we’ll have them up the same day.' },
]

export const sampleAssets = (): Asset[] => {
  const base = { clientEmail: 'jane@acmeplumbing.com', files: [], link: '', text: '', notes: '', feedback: '', liveLink: '', addedBy: '' }
  return [
    { ...base, id: 'a1', title: 'Homepage hero and headline', category: 'Copy', source: 'Hewn', status: 'In review', addedAt: ago(0.3), updatedAt: ago(0.3),
      text: 'On site in 2 hours. Flat-rate pricing.\nDavis County’s fastest plumbers — no surprises on the bill.', notes: 'Two headline options are in the doc; pick one.', feedback: 'Oct 30, 4:10 PM · jason: In review' },
    { ...base, id: 'a2', title: 'Google search ad set 1', category: 'Ads', source: 'Hewn', status: 'In review', addedAt: ago(0.5), updatedAt: ago(0.5),
      text: 'Emergency Plumber Near You | On Site in 2 Hours\nFlat-rate pricing, licensed and insured. Call now.' },
    { ...base, id: 'a3', title: 'Target keywords', category: 'Keywords & SEO', source: 'Hewn', status: 'Approved', addedAt: ago(2), updatedAt: ago(1.5),
      text: 'emergency plumber layton\nwater heater replacement davis county\ndrain cleaning kaysville', feedback: 'Oct 29, 9:00 AM · Jane Smith: Approved' },
    { ...base, id: 'a4', title: 'Spring tune-up landing page', category: 'Landing pages', source: 'Hewn', status: 'Live', addedAt: ago(4), updatedAt: ago(3), link: 'https://acmeplumbing.com/spring', liveLink: 'https://acmeplumbing.com/spring' },
    { ...base, id: 'a5', title: 'Customer video: kitchen remodel', category: 'UGC & video', source: 'Client', status: 'Received', addedAt: ago(1), updatedAt: ago(1), link: 'https://drive.google.com/', notes: 'Our favorite review video' },
    { ...base, id: 'a6', title: 'Brand guide v1', category: 'Brand guide', source: 'Hewn', status: 'Changes requested', addedAt: ago(3), updatedAt: ago(2),
      link: 'https://www.figma.com/', feedback: 'Oct 28, 2:00 PM · scott: In review\nOct 28, 5:30 PM · Jane Smith: Changes requested — Can we try a brighter blue?' },
  ]
}
