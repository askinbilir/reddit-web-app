import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import React from 'react'
import PostComment from './post-comment'
import CreateComment from './create-comment'

interface CommentSectionProps {
  postId: string
}

export default async function CommentSection({ postId }: CommentSectionProps) {
  const session = await getAuthSession()

  const comments = await db.comment.findMany({
    where: { postId, replyTo: null },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true
        }
      }
    }
  })

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter(comment => !comment.replyToId)
          .map(parentComment => {
            const parentCommentsAmt = parentComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === 'UP') return acc + 1
                if (vote.type === 'DOWN') return acc - 1
                return acc
              },
              0
            )
            const parentCommentVote = parentComment.votes.find(
              vote => vote.userId === session?.user.id
            )

            return (
              <div key={parentComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    postId={postId}
                    comment={parentComment}
                    currentVote={parentCommentVote}
                    votesAmt={parentCommentsAmt}
                  />
                </div>

                {/* render replies */}
                {parentComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map(reply => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === 'UP') return acc + 1
                      if (vote.type === 'DOWN') return acc - 1
                      return acc
                    }, 0)
                    const replyVote = reply.votes.find(
                      vote => vote.userId === session?.user.id
                    )

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-l-2 border-primary/20"
                      >
                        <PostComment
                          postId={postId}
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
  )
}
