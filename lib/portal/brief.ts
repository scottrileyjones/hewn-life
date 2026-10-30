/**
 * The build brief: everything a client has submitted in onboarding, as one
 * Markdown document with a prompt on top, ready to paste into Claude to start
 * their build.
 */
import { packageName, stepsFor } from './onboarding'
import type { PortalClient } from './data'

export function buildBrief(c: PortalClient): string {
  const steps = stepsFor(c.package).filter(s => s.owner === 'client' && (s.fields?.length || s.uploads))
  const pkg = packageName(c.package) || c.plan || 'their package'
  const lines: string[] = [
    `# Build brief: ${c.company || c.name || c.email}`,
    '',
    `You are building for a Hewn Life client who bought **${pkg}**. Use the answers, copy and assets below as the source of truth. Where the client asked us to write the copy, write it in their voice from these answers. Build mobile-first, make the primary call to action obvious on every page, and flag anything missing instead of inventing facts (no made-up reviews, numbers or credentials).`,
    '',
    `- Client: ${c.name || '—'} (${c.email})`,
    `- Package: ${pkg}`,
    `- Brief generated: ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'medium', timeStyle: 'short' })} (Mountain)`,
    '',
  ]
  for (const s of steps) {
    const st = c.progress[s.id]
    lines.push(`## ${s.title}`, '')
    if (!st?.submitted) { lines.push('_Not submitted yet._', ''); continue }
    for (const f of s.fields ?? []) {
      const v = (st.data?.[f.id] || '').trim()
      if (!v) continue
      lines.push(v.includes('\n') ? `**${f.label}:**\n\n${v}\n` : `- **${f.label}:** ${v}`)
    }
    const files = c.assets.filter(a => a.name.startsWith(`${s.id}--`))
    if (files.length) {
      lines.push('', '**Files** (links expire after a few hours; download them before you start):')
      for (const a of files) lines.push(`- [${a.name.slice(s.id.length + 2)}](${a.url})`)
    }
    lines.push('')
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
