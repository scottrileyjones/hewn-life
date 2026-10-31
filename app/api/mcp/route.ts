import { mcpGet, mcpPost } from '@/lib/mcp/route'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || ''
  return mcpPost(req, auth.startsWith('Bearer ') ? auth.slice(7).trim() : null)
}
export const GET = mcpGet
