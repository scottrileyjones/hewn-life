/** Small rounded label above section headings. */
export default function Pill({ children, dark = false, dot }: { children: React.ReactNode; dark?: boolean; dot?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-body text-xs font-medium ${
        dark ? 'bg-white/[0.08] text-white/80 border border-white/10' : 'bg-white text-[#0D0D0D] border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot ?? '#6BAD3D' }} />
      {children}
    </span>
  )
}

export function PillarIcon({ paths, color, className = 'w-5 h-5' }: { paths: string[]; color: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map(d => <path key={d} d={d} />)}
    </svg>
  )
}
