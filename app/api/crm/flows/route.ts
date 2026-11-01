import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/crm/auth'
import { emailHtml, loadFlows, loadRuns, mergeVars, runDue, saveFlow, setRunStatus } from '@/lib/flows/engine'
import { FLOW_KEYS, fill, type Flow, type FlowKey } from '@/lib/flows/defaults'
import { send } from '@/lib/plans/email'
import { sendSms, teamNumbers } from '@/lib/sms'
import { marketingText } from '@/lib/smsText'

type Body =
  | { action: 'save'; flow: Pick<Flow, 'key' | 'name' | 'status' | 'steps'> }
  | { action: 'runs'; key: FlowKey }
  | { action: 'remove'; id: string }
  | { action: 'test'; key: FlowKey; index: number }
  | { action: 'run' }

const SAMPLE = { name: 'Jane Smith', company: 'Acme Plumbing', email: 'jane@example.com', context: { plan: 'Website in a Day', checkout_link: '/checkout' } }

/** HQ → Flows: edit flows, see and remove people in them, send yourself a test, run due steps now. */
export async function POST(req: NextRequest) {
  const user = currentUser()
  if (!user) return NextResponse.json({ error: 'Signed out' }, { status: 401 })
  const b = await req.json().catch(() => ({})) as Body
  try {
    if (b.action === 'save') {
      if (!FLOW_KEYS.includes(b.flow?.key)) return NextResponse.json({ error: 'Unknown flow' }, { status: 400 })
      if (!b.flow.steps?.length) return NextResponse.json({ error: 'A flow needs at least one step.' }, { status: 400 })
      return NextResponse.json({ ok: true, flow: await saveFlow({ ...b.flow, status: b.flow.status === 'Active' ? 'Active' : 'Paused' }, user) })
    }
    if (b.action === 'runs') return NextResponse.json({ ok: true, runs: await loadRuns(b.key) })
    if (b.action === 'remove') return NextResponse.json({ ok: true, run: await setRunStatus(b.id, 'Exited', `removed by ${user}`) })
    if (b.action === 'run') return NextResponse.json({ ok: true, ...(await runDue()) })
    if (b.action === 'test') {
      const flow = (await loadFlows()).find(f => f.key === b.key)
      const step = flow?.steps[b.index]
      if (!step) return NextResponse.json({ error: 'Save the flow first, then test a step.' }, { status: 400 })
      const vars = mergeVars(SAMPLE)
      if (step.channel === 'sms') {
        const to = teamNumbers()
        if (!to.length) return NextResponse.json({ error: 'Add your phones to TEAM_SMS_TO in Vercel to test texts.' }, { status: 400 })
        await Promise.all(to.map(n => sendSms(n, marketingText(fill(step.body, vars)))))
        return NextResponse.json({ ok: true, to: 'your phones' })
      }
      await send(user, `[Test] ${fill(step.subject, vars)}`, emailHtml(fill(step.body, vars), user))
      return NextResponse.json({ ok: true, to: user })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error('Flows action failed:', err)
    return NextResponse.json({ error: 'Couldn’t save. Try again.' }, { status: 502 })
  }
}
