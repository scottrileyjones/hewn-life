import { mcpGet, mcpPost } from '@/lib/mcp/route'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request, { params }: { params: { key: string } }) {
  return mcpPost(req, params.key)
}
export const GET = mcpGet
