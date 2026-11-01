/** Checks a deal from the HQ form before it's frozen and sent. */
import { ADD_ONS, PRODUCTS, addOnTotal, isRetainer, type Deal } from './templates'

const s = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v)

export function cleanDeal(raw: Record<string, unknown>): { deal?: Deal; error?: string } {
  const product = PRODUCTS.find(p => p === raw.product)
  if (!product) return { error: 'Pick a product.' }
  const addOns = Array.isArray(raw.addOns)
    ? (raw.addOns as { name?: unknown; qty?: unknown }[]).map(a => ({ name: s(a.name, 100), qty: Math.max(0, Math.min(50, Math.floor(Number(a.qty) || 0))) })).filter(a => a.qty > 0 && ADD_ONS.some(x => x.name === a.name))
    : []
  const billing = isRetainer(product) ? (raw.billing === 'annual' ? 'annual' : 'monthly') : 'one-time'
  const deal: Deal = {
    product, billing, addOns,
    clientLegalName: s(raw.clientLegalName, 200), clientEntity: s(raw.clientEntity, 200), clientAddress: s(raw.clientAddress, 300),
    signerName: s(raw.signerName, 120), signerTitle: s(raw.signerTitle, 120), signerEmail: s(raw.signerEmail, 200).toLowerCase(),
    effectiveDate: s(raw.effectiveDate, 10), startDate: s(raw.startDate, 10),
    fee: product === 'Add-on services' ? addOnTotal(addOns) : Math.round(Number(raw.fee) * 100) / 100,
    adBudget: s(raw.adBudget, 120), projectTitle: s(raw.projectTitle, 160), scope: s(raw.scope, 6000), deliverables: s(raw.deliverables, 6000),
    schedule: s(raw.schedule, 2000), paymentTerms: s(raw.paymentTerms, 2000), specialTerms: s(raw.specialTerms, 6000),
  }
  if (!deal.clientLegalName) return { error: 'Add the client’s legal business name.' }
  if (!deal.signerName) return { error: 'Add who signs for the client.' }
  if (!isDate(deal.effectiveDate) || !isDate(deal.startDate)) return { error: 'Add the effective and start dates.' }
  if (!(deal.fee > 0)) return { error: product === 'Add-on services' ? 'Pick at least one add-on.' : 'Add the fee.' }
  if (product === 'Custom project' && (!deal.scope || !deal.deliverables)) return { error: 'Describe the project scope and deliverables.' }
  return { deal }
}
