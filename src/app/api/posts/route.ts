import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const session = await getAuthSession()

  let followedCommunitiesIds: string[] = []

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: { userId: session.user.id },
      include: { subreddit: true }
    })

    followedCommunitiesIds = followedCommunities.map(
      ({ subreddit }) => subreddit.id
    )
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional()
      })
      .parse({
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
        subredditName: url.searchParams.get('subredditName')
      })

    let whereClause = {}

    if (subredditName) {
      whereClause = {
        subreddit: { name: subredditName }
      }
    } else if (session) {
      whereClause = {
        subreddit: {
          id: { in: followedCommunitiesIds }
        }
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true
      },
      where: whereClause
    })

    return NextResponse.json(posts, { status: StatusCodes.OK })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', {
        status: StatusCodes.UNPROCESSABLE_ENTITY
      })
    }

    return new Response('Could not fetch more posts', {
      status: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}
