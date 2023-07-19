import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentVoteValidator } from '@/lib/validators/vote'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { commentId, voteType } = CommentVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: StatusCodes.UNAUTHORIZED })
    }

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId
      }
    })

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id
            }
          }
        })
        return new Response('OK', { status: StatusCodes.OK })
      } else {
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id
            }
          },
          data: { type: voteType }
        })
      }

      return new Response('OK', {status: StatusCodes.OK})
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId
      }
    })

    return new Response('OK', { status: StatusCodes.CREATED })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', {
        status: StatusCodes.UNPROCESSABLE_ENTITY
      })
    }

    return new Response('Could not register vote, please try again later', {
      status: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}
