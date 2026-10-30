import Link from 'next/link'
import type { ReactNode } from 'react'

/** Top bar shared by the CRM's Pipeline and HQ pages. */
export default function CrmHeader({ active, user, children }: { active: 'pipeline' | 'hq'; user: string; children?: ReactNode }) {
  const tab = (key: 'pipeline' | 'hq', href: string, label: string) => (
    <Link href={href} aria-current={active === key ? 'page' : undefined}
      className={`rounded-full px-3 py-1.5 transition ${active === key ? 'bg-forest text-mist' : 'text-ink/70 hover:text-ink'}`}>{label}</Link>
  )
  return (
    <header className="sticky top-0 z-30 border-b border-ink/[0.08] bg-bone/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <p className="font-display text-[18px] font-semibold tracking-[-0.02em]">hewn<span className="accent text-ember">life</span></p>
        <nav className="flex rounded-full border border-ink/[0.12] bg-white p-0.5 font-body text-[13px]" aria-label="CRM sections">
          {tab('hq', '/hq', 'HQ')}
          {tab('pipeline', '/crm', 'Pipeline')}
        </nav>
        {children}
        <div className="ml-auto flex items-center gap-3 font-body text-[13px] text-ink/60">
          <span className="hidden sm:inline">{user}</span>
          <form action="/api/crm/logout" method="post"><button className="underline underline-offset-2 hover:text-ink">Sign out</button></form>
        </div>
      </div>
    </header>
  )
}
