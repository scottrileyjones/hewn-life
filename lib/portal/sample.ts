/** A made-up client and thread for previewing the portal locally (PLAN_SAMPLE=1 only). */
import type { PortalClient, PortalMessage } from './data'

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
