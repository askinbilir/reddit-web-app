import { Config } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { PostVoteValidator } from '@/lib/validators/vote'
import { CachedPost } from '@/types/redis'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { postId, voteType } = PostVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: StatusCodes.UNAUTHORIZED })
    }

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId
      }
    })

    const post = await db.post.findUnique({
      where: { id: postId },
      include: { author: true, votes: true }
    })

    if (!post) {
      return new Response('Post not found', { status: StatusCodes.NOT_FOUND })
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id
            }
          }
        })
        return new Response('OK', { status: StatusCodes.OK })
      }

      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id
          }
        },
        data: { type: voteType }
      })

      // recount the votes
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === 'UP') return acc + 1
        if (vote.type === 'DOWN') return acc - 1
        
        return acc
      }, 0)

      if (votesAmt >= Config.CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          authorUsername: post.author.username!,
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          createdAt: post.createdAt
        }

        await redis.hset(`post:${postId}`, cachePayload)
      }
      return new Response('OK', { status: StatusCodes.OK })
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId
      }
    })

    // recount the votes
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1

      return acc
    }, 0)

    if (votesAmt >= Config.CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        authorUsername: post.author.username!,
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        createdAt: post.createdAt
      }

      await redis.hset(`post:${postId}`, cachePayload)
    }

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
