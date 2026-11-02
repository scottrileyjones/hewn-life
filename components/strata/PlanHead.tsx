/**
 * A plan's heading in the clean checkout style: the name, a forest price
 * pill with the plan's badge beside it, then a short uppercase tagline.
 */
export default function PlanHead({ name, price, per = '/mo', badge, eyebrow }: { name: string; price: number; per?: string; badge?: string | null; eyebrow?: string }) {
  return (
    <div>
      <p className="font-display text-[34px] font-medium leading-[1.05] tracking-[-0.035em]">{name}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-forest px-3.5 py-1.5 font-body text-[15px] font-semibold leading-none tabular-nums text-white">
          ${price.toLocaleString()}<span className="font-medium text-white/75">{per}</span>
        </span>
        {badge && <span className="rounded-full bg-lime px-3 py-1.5 font-body text-[12px] font-semibold leading-none text-forest">{badge}</span>}
      </div>
      {eyebrow && <p className="mt-5 font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-ink">{eyebrow}</p>}
    </div>
  )
}
