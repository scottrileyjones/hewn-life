/** A made-up agreement for local previews (PLAN_SAMPLE=1 only). */
import { blankDeal, render } from './templates'
import { hashDoc, type Agreement } from './data'
import { docFromMarkdown, type InternalTerms } from './internal'

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

/** A made-up internal document for previews. */
export function sampleInternal(signed: boolean): Agreement {
  const doc = docFromMarkdown(`# **Sample Operating Agreement**\n\n## **A Utah limited liability company · Effective November 1, 2026**\n\nThis Operating Agreement is entered into by **Alex Hewn** and **Sam Rivera** (each a “Member”).\n\n## **Article 1 — Formation**\n\n1.1 **Formation.** The Company was formed on \\_\\_\\_\\_.\n\n## **Article 2 — Units**\n\n|  |  |  |\n| :-: | :-: | :-: |\n| Member | Class | Units |\n| Alex Hewn | Class A | 7,500,000 |\n| Sam Rivera | Class B | 2,500,000 |\n\n## **Signatures**\n\nThe Members have signed this Agreement as of the Effective Date.\n\nBy: \\_\\_\\_\\_`, { 'on \\_\\_\\_\\_.': 'on October 28, 2026.' })
  const terms: InternalTerms = { kind: 'internal', signers: [
    { name: 'Alex Hewn', email: 'alex@hewn.life', title: 'Manager and Chief Executive Officer', capacities: ['Hewn Holdings LLC, by its Manager', 'Member (Class A)'] },
    { name: 'Sam Rivera', email: 'sam@hewn.life', title: 'Chief Operating Officer', capacities: ['Member (Class B)'], askAddress: true },
  ] }
  const at = '2026-11-01T18:00:00.000Z'
  return {
    id: signed ? 'recSAMPLEsignedXX' : 'recSAMPLEinternal', title: 'Sample Operating Agreement', clientEmail: 'sam@hewn.life', company: 'Hewn Holdings LLC',
    product: 'Founding document' as Agreement['product'], status: signed ? 'Signed' : 'Sent', deal: terms as unknown as Agreement['deal'], doc, hash: hashDoc(doc),
    hewnSig: signed ? { name: 'Alex Hewn', title: 'Manager and Chief Executive Officer', email: 'alex@hewn.life', at, ip: '203.0.113.5' } : null,
    clientSig: signed ? { name: 'Sam Rivera', title: 'Chief Operating Officer', email: 'sam@hewn.life', at: '2026-11-01T19:10:00.000Z', ip: '198.51.100.7', address: '100 Main St, Kaysville, UT 84037' } : null,
    sentAt: at, viewedAt: '', signedAt: signed ? '2026-11-01T19:10:00.000Z' : '', pdfUrl: '', log: `${at} · created for signing`,
  }
}
