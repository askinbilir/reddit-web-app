import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubredditSubscriptionValidator } from '@/lib/validators/subreddit'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: StatusCodes.UNAUTHORIZED })
    }

    const body = await req.json()

    const { subredditId } = SubredditSubscriptionValidator.parse(body)

    const subscriptionExist = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id }
    })

    if (!subscriptionExist) {
      return new Response('You are not subscribed to this subreddit', {
        status: StatusCodes.BAD_REQUEST
      })
    }

    const isCreator = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id
      }
    })

    if (isCreator) {
      return new Response("You can't unsubscribe from your own subreddit", {
        status: StatusCodes.BAD_REQUEST
      })
    }

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id
        }
      }
    })

    return new Response(subredditId, { status: StatusCodes.CREATED })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', {
        status: StatusCodes.UNPROCESSABLE_ENTITY
      })
    }

    return new Response('Could not unsubscribe, please try again later', {
      status: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}
