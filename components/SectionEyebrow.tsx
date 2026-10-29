/** Uppercase section label. `light` = sits on a light ground. */
export default function SectionEyebrow({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className={`block h-3.5 w-[3px] ${light ? 'bg-ember' : 'bg-lime'}`} />
      <p className={`font-mono text-[11px] font-medium uppercase tracking-[0.2em] ${light ? 'text-forest' : 'text-lime'}`}>
        {text}
      </p>
    </div>
  )
}
