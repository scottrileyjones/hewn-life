import { NextResponse } from 'next/server'
import { authorized, handle } from './server'

/** Shared by /api/mcp (key in an Authorization: Bearer header) and /api/mcp/{key} (key in the URL, for connectors that can't send headers). */
export async function mcpPost(req: Request, key: string | null) {
  if (!authorized(key)) return NextResponse.json({ jsonrpc: '2.0', id: null, error: { code: -32001, message: 'Unauthorized' } }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, { status: 400 })
  if (Array.isArray(body)) {
    const out = (await Promise.all(body.map(handle))).filter(Boolean)
    return out.length ? NextResponse.json(out) : new NextResponse(null, { status: 202 })
  }
  const out = await handle(body)
  return out ? NextResponse.json(out) : new NextResponse(null, { status: 202 })
}

/** No server-to-client stream: this server only answers requests. */
export const mcpGet = () => new NextResponse('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } })
