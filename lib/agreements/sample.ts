/** A made-up agreement for local previews (PLAN_SAMPLE=1 only). */
import { blankDeal, render } from './templates'
import { hashDoc, type Agreement } from './data'

export function sampleAgreement(product: Parameters<typeof blankDeal>[0] = 'Wrought', signed = false): Agreement {
  const deal = { ...blankDeal(product, { company: 'Acme Plumbing LLC', name: 'Jane Smith', email: 'jane@acmeplumbing.com' }), clientEntity: 'a Utah limited liability company', clientAddress: '120 W Center St, Bountiful, UT 84010', adBudget: '$3,000', startDate: '2026-11-10', effectiveDate: '2026-11-03' }
  const doc = render(deal)
  const at = '2026-11-03T16:20:00.000Z'
  return {
    id: `recSAMPLE${product.replace(/\W/g, '').slice(0, 8).padEnd(8, 'x')}`, title: `${product} · Acme Plumbing LLC`, clientEmail: 'jane@acmeplumbing.com', company: 'Acme Plumbing',
    product, status: signed ? 'Signed' : 'Viewed', deal, doc, hash: hashDoc(doc),
    hewnSig: { name: 'Alex Hewn', title: 'Managing Member', email: 'team@hewn.life', at, ip: '203.0.113.5' },
    clientSig: signed ? { name: 'Jane Smith', title: 'Owner', email: 'jane@acmeplumbing.com', at: '2026-11-03T18:02:00.000Z', ip: '198.51.100.7', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' } : null,
    sentAt: at, viewedAt: '2026-11-03T17:55:00.000Z', signedAt: signed ? '2026-11-03T18:02:00.000Z' : '', pdfUrl: '',
    log: `${at} · created, countersigned by Alex Hewn (team@hewn.life) and sent to jane@acmeplumbing.com\n2026-11-03T17:55:00.000Z · opened by jane@acmeplumbing.com · IP 198.51.100.7${signed ? '\n2026-11-03T18:02:00.000Z · signed by Jane Smith, Owner (jane@acmeplumbing.com) · IP 198.51.100.7' : ''}`,
  }
}
