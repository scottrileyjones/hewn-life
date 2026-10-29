import Link from 'next/link'
import SectionEyebrow from '@/components/SectionEyebrow'

export default function CancelShell({ title, lede, children }: { title: string; lede: string; children: React.ReactNode }) {
  return (
    <div className="bg-bone px-6 pb-24 pt-36 lg:px-12">
      <div className="mx-auto max-w-xl">
        <SectionEyebrow text="Account" light />
        <h1 className="mb-4 font-display text-[40px] font-medium leading-[1.05] tracking-[-0.04em] text-ink md:text-[52px]">{title}</h1>
        <p className="mb-8 font-body text-base leading-relaxed text-ink/70">{lede}</p>
        <div className="rounded-[28px] border border-ink/[0.08] bg-white p-7 sm:p-10">{children}</div>
        <p className="mt-6 font-body text-[13px] leading-relaxed text-ink/60">
          Cancelling stops future renewals; you keep your plan until the end of the period you’ve paid for. See <Link href="/legal/refund" className="text-forest underline underline-offset-2">Refunds &amp; Cancellations</Link>.
        </p>
      </div>
    </div>
  )
}
