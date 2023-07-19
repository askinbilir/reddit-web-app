import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubredditValidator } from '@/lib/validators/subreddit'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: StatusCodes.UNAUTHORIZED })
    }

    const body = await req.json()
    const { name } = SubredditValidator.parse(body)

    const subredditExist = await db.subreddit.findFirst({
      where: { name }
    })

    if (subredditExist) {
      return new Response('Subreddit already exists.', {
        status: StatusCodes.CONFLICT
      })
    }

    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id
      }
    })

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id
      }
    })

    return new Response(subreddit.name, { status: StatusCodes.CREATED })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY
      })
    }

    return new Response('Could not create subreddit', {
      status: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}
