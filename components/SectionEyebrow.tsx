export default function SectionEyebrow({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`block w-4 h-[1px] ${light ? 'bg-slate' : 'bg-ember'}`} />
      <p className={`font-mono text-[11px] uppercase tracking-[0.22em] font-medium ${light ? 'text-slate' : 'text-ember'}`}>
        {text}
      </p>
    </div>
  )
}
