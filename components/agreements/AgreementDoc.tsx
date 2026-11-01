import type { Doc } from '@/lib/agreements/templates'

/** The agreement as a readable document: MSA sections, then the Order Form set off in its own panel. */
export default function AgreementDoc({ doc }: { doc: Doc }) {
  const split = doc.sections.findIndex(s => s.heading.startsWith('Order Form'))
  const msa = split < 0 ? doc.sections : doc.sections.slice(0, split)
  const order = split < 0 ? [] : doc.sections.slice(split)
  const block = (s: Doc['sections'][number], i: number) => (
    <section key={i} className="mt-5 first:mt-0">
      <h3 className="font-display text-[15px] font-semibold tracking-[-0.01em]">{s.heading}</h3>
      {s.paragraphs.map((p, j) => <p key={j} className="mt-1.5 font-body text-[14px] leading-relaxed text-ink/80">{p}</p>)}
      {s.list && <ul className="mt-1.5 list-disc space-y-1 pl-5 font-body text-[14px] leading-relaxed text-ink/80 marker:text-ember">{s.list.map((l, j) => <li key={j}>{l}</li>)}</ul>}
    </section>
  )
  return (
    <article className="font-body">
      <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] sm:text-[26px]">{doc.title}</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-ink/75">{doc.parties}</p>
      {order.length > 0 && (
        <div className="mt-6 rounded-[20px] border border-forest/20 bg-[#F4F8EF] p-5 sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest">Your order</p>
          <div className="mt-2">{order.map((s, i) => block(i === 0 ? { ...s, heading: s.heading.replace('Order Form: ', '') } : s, i))}</div>
        </div>
      )}
      <div className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Master Services Agreement</p>
        <div className="mt-3">{msa.map(block)}</div>
      </div>
    </article>
  )
}
