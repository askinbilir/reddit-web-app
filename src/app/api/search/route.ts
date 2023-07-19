import { db } from '@/lib/db'
import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')

  if (!q) {
    return new Response('Invalid query', { status: StatusCodes.BAD_REQUEST })
  }

  const results = await db.subreddit.findMany({
    where: {
      name: {
        startsWith: q
      }
    },
    include: {
      _count: true
    },
    take: 5
  })

  return NextResponse.json(results, { status: StatusCodes.OK })
}
