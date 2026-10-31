import Link from 'next/link'

/** Top bar for every portal page: Overview and Assets, with a badge for what's waiting on them. */
export default function PortalHeader({ email, active, toReview = 0, wide }: { email: string; active: 'overview' | 'assets'; toReview?: number; wide?: boolean }) {
  const tab = (key: 'overview' | 'assets', href: string, label: string, badge = 0) => (
    <Link href={href} aria-current={active === key ? 'page' : undefined}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${active === key ? 'bg-forest text-mist' : 'text-ink/70 hover:text-ink'}`}>
      {label}{badge > 0 && <span className={`rounded-full px-1.5 text-[11px] font-semibold ${active === key ? 'bg-lime text-forest' : 'bg-lime text-forest'}`}>{badge}</span>}
    </Link>
  )
  return (
    <header className="border-b border-ink/[0.08] bg-bone">
      <div className={`mx-auto flex ${wide ? 'max-w-[1500px] px-3 sm:px-5' : 'max-w-[1180px] px-4 sm:px-6'} items-center gap-3 py-2.5`}>
        <p className="font-display text-[18px] font-semibold tracking-[-0.02em]">hewn<span className="accent text-ember">life</span></p>
        <nav className="flex rounded-full border border-ink/[0.12] bg-white p-0.5 font-body text-[13px]" aria-label="Portal sections">
          {tab('overview', '/portal', 'Overview')}
          {tab('assets', '/portal/assets', 'Assets', toReview)}
        </nav>
        <div className="ml-auto flex items-center gap-3 font-body text-[13px] text-ink/60">
          <span className="hidden md:inline">{email}</span>
          <form action="/api/portal/logout" method="post"><button className="underline underline-offset-2 hover:text-ink">Sign out</button></form>
        </div>
      </div>
    </header>
  )
}
