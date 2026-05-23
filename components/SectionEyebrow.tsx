export default function SectionEyebrow({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <p className={`font-body text-[11px] uppercase tracking-[0.2em] font-medium mb-4 ${light ? 'text-slate' : 'text-copper'}`}>
      {text}
    </p>
  )
}
