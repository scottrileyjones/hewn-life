export default function Palette() {
  const colors = [
    { name: 'iron / ink / obsidian', hex: '#1A1815', dark: true },
    { name: 'forge', hex: '#0E0D0B', dark: true },
    { name: 'charcoal', hex: '#2A2824', dark: true },
    { name: 'bone / cream', hex: '#F2ECE0', dark: false },
    { name: 'stone / marble', hex: '#E8DFC0', dark: false },
    { name: 'oat', hex: '#DCCFB6', dark: false },
    { name: 'slate', hex: '#3F4A47', dark: true },
    { name: 'moss', hex: '#4A5348', dark: true },
    { name: 'clay', hex: '#685544', dark: true },
    { name: 'ash', hex: '#A89F92', dark: false },
    { name: 'ember', hex: '#7CB550', dark: false },
    { name: 'copper', hex: '#B5621C', dark: true },
    { name: 'hewn', hex: '#8C4612', dark: true },
  ]

  return (
    <div className="min-h-screen bg-bone p-12">
      <h1 className="font-display font-bold text-[40px] text-ink mb-10">Colour Palette</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {colors.map(c => (
          <div key={c.hex} className="rounded-2xl overflow-hidden border border-black/10">
            <div className="h-28" style={{ background: c.hex }} />
            <div className="bg-white px-4 py-3">
              <p className="font-body text-sm font-medium text-ink">{c.name}</p>
              <p className="font-mono text-xs text-slate/60">{c.hex}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
