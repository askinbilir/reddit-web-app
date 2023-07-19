import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: StatusCodes.UNAUTHORIZED })
    }

    const body = await req.json()

    const { subredditId, title, content } = PostValidator.parse(body)

    const subscriptionExist = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id }
    })

    if (!subscriptionExist) {
      return new Response('Subscribe to post', {
        status: StatusCodes.BAD_REQUEST
      })
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      }
    })

    return new Response('OK', { status: StatusCodes.CREATED })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', {
        status: StatusCodes.UNPROCESSABLE_ENTITY
      })
    }

    return new Response('Could not post to subreddit at this time, try again later', {
      status: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}
