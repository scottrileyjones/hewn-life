/**
 * The startup checklist Scott and Jason share on the CRM's HQ page, stored in
 * the Startup Checklist table in Airtable.
 */
const BASE = process.env.AIRTABLE_BASE_ID
const TOKEN = process.env.AIRTABLE_TOKEN
const TABLE = process.env.AIRTABLE_CHECKLIST_TABLE_ID || 'tbl6RYQGaYf0sHdUf'

export const AREAS = ['Legal & entity', 'Money & tax', 'Brand & presence', 'Sales', 'Delivery & ops', 'Systems'] as const
export const OWNERS = ['Scott', 'Jason', 'Both'] as const
export const STATUSES = ['To do', 'In progress', 'Waiting', 'Done'] as const
export type Area = typeof AREAS[number]
export type Owner = typeof OWNERS[number]
export type Status = typeof STATUSES[number]

export type Task = {
  id: string
  task: string
  area: Area
  owner: Owner
  status: Status
  due: string
  notes: string
  order: number
  updatedBy: string
  updatedAt: string
}

export type TaskPatch = Partial<Pick<Task, 'task' | 'area' | 'owner' | 'status' | 'due' | 'notes'>>

type Row = { id: string; fields: Record<string, unknown> }
const str = (v: unknown) => (typeof v === 'string' ? v : '')
const oneOf = <T extends string>(list: readonly T[], v: unknown, fallback: T): T => (list.includes(v as T) ? (v as T) : fallback)

const toTask = (r: Row): Task => ({
  id: r.id,
  task: str(r.fields['Task']),
  area: oneOf(AREAS, r.fields['Area'], 'Systems'),
  owner: oneOf(OWNERS, r.fields['Owner'], 'Both'),
  status: oneOf(STATUSES, r.fields['Status'], 'To do'),
  due: str(r.fields['Due']),
  notes: str(r.fields['Notes']),
  order: typeof r.fields['Order'] === 'number' ? (r.fields['Order'] as number) : 999,
  updatedBy: str(r.fields['Updated by']),
  updatedAt: str(r.fields['Updated at']),
})

const api = () => `https://api.airtable.com/v0/${BASE}/${TABLE}`
const headers = () => ({ Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' })

export async function loadTasks(): Promise<Task[]> {
  if (!BASE || !TOKEN) throw new Error('Airtable not configured')
  const rows: Row[] = []
  let offset: string | undefined
  do {
    const res = await fetch(`${api()}?pageSize=100${offset ? `&offset=${offset}` : ''}`, { headers: headers(), cache: 'no-store' })
    if (!res.ok) throw new Error(`Airtable checklist ${res.status}: ${await res.text()}`)
    const out = await res.json() as { records: Row[]; offset?: string }
    rows.push(...out.records)
    offset = out.offset
  } while (offset)
  return rows.map(toTask).filter(t => t.task).sort((a, b) => a.order - b.order)
}

const toFields = (p: TaskPatch, user: string) => {
  const f: Record<string, unknown> = { 'Updated by': user, 'Updated at': new Date().toISOString() }
  if (p.task !== undefined) f['Task'] = p.task.slice(0, 200)
  if (p.area !== undefined) f['Area'] = p.area
  if (p.owner !== undefined) f['Owner'] = p.owner
  if (p.status !== undefined) f['Status'] = p.status
  if (p.due !== undefined) f['Due'] = p.due || null
  if (p.notes !== undefined) f['Notes'] = p.notes.slice(0, 5000)
  return f
}

/** Update a task, or create one when there's no id. Returns the saved task. */
export async function saveTask(id: string | null, patch: TaskPatch, user: string, order?: number): Promise<Task> {
  if (!BASE || !TOKEN) throw new Error('Airtable not configured')
  const fields = toFields(patch, user)
  if (!id && order !== undefined) fields['Order'] = order
  const res = id
    ? await fetch(`${api()}/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ fields, typecast: true }) })
    : await fetch(api(), { method: 'POST', headers: headers(), body: JSON.stringify({ records: [{ fields }], typecast: true }) })
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`)
  const out = await res.json() as Row | { records: Row[] }
  return toTask('records' in out ? out.records[0] : out)
}

export async function deleteTask(id: string) {
  if (!BASE || !TOKEN) throw new Error('Airtable not configured')
  const res = await fetch(`${api()}/${id}`, { method: 'DELETE', headers: headers() })
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`)
}
