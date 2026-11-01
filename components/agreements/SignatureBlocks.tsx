import { HEWN } from '@/lib/agreements/templates'

type Sig = { name: string; title: string; at?: string }

const day = (iso?: string) => new Date(iso || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

/**
 * The signature page under an agreement: Hewn Life's signature (already applied)
 * beside the client's, which shows as they type it until they sign.
 */
export default function SignatureBlocks({ hewn, client, clientEntity }: { hewn: Sig | null; client: (Sig & { signed?: boolean }) | null; clientEntity: string }) {
  const block = (party: string, entity: string, sig: Sig | null, signed: boolean) => (
    <div className="min-w-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">{party}</p>
      <p className="mt-1 font-body text-[13px] font-semibold text-ink">{entity}</p>
      <p className={`mt-3 min-h-[44px] truncate font-accent text-[30px] italic leading-tight ${signed ? 'text-forest' : 'text-forest/45'}`}>
        {sig?.name || <span className="font-body text-[13px] not-italic text-ink/35">Your signature goes here</span>}
      </p>
      <div className="border-t border-ink/25 pt-2">
        <p className="font-body text-[13px] text-ink/80">{sig?.name ? `${sig.name}${sig.title ? `, ${sig.title}` : ''}` : 'Name, title'}</p>
        <p className={`mt-0.5 flex items-center gap-1.5 font-body text-[12px] ${signed ? 'text-forest' : 'text-ink/45'}`}>
          {signed && <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          {signed ? `Signed electronically ${day(sig?.at)}` : 'Not signed yet'}
        </p>
      </div>
    </div>
  )
  return (
    <section aria-label="Signatures" className="mt-8 border-t border-ink/10 pt-6">
      <h3 className="font-display text-[15px] font-semibold tracking-[-0.01em]">Signatures</h3>
      <div className="mt-4 grid grid-cols-1 gap-7 sm:grid-cols-2">
        {block('Hewn Life', `${HEWN.legalName}, dba ${HEWN.dba}`, hewn, Boolean(hewn))}
        {block('Client', clientEntity || 'Client', client, Boolean(client?.signed))}
      </div>
    </section>
  )
}
