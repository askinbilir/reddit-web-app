import { Icons } from '@/components/icons'
import CommentSection from '@/components/comment-section'
import EditorOutput from '@/components/editor-output'
import PostVoteServer from '@/components/post-vote/post-vote-server'
import { buttonVariants } from '@/components/ui/button'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

interface PageProps {
  params: { postId: string }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Page({ params }: PageProps) {
  const { postId } = params

  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost

  let post: (Post & { votes: Vote[]; author: User }) | null = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: { id: postId },
      include: {
        votes: true,
        author: true
      }
    })
  }

  if (!post && !cachedPost) return notFound()

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: { id: postId },
                include: { votes: true }
              })
            }}
          />
        </Suspense>

        <div className="sm:w-0 w-full flex-1 bg-secondary p-4 rounded-sm">
          <p className="max-h-4 mt-1 truncate text-xs text-primary/60">
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-primary">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense
            fallback={
              <Icons.loader className="w-5 h-5 animate-spin text-primary/60" />
            }
          >
            <CommentSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function PostVoteShell() {
  return (
    <div className="w-20 flex flex-col items-center pr-8">
      {/* upvote */}
      <div
        className={buttonVariants({
          variant: 'ghost',
          className: 'hover:bg-primary/5'
        })}
      >
        <Icons.arrowUp className="w-6 h-6 text-primary/60" />
      </div>

      {/* score */}
      <div className="text-center py-2 font-medium text-sm text-primary">
        <Icons.loader className="w-3 h-3 animate-spin" />
      </div>

      {/* downvote */}
      <div
        className={buttonVariants({
          variant: 'ghost',
          className: 'hover:bg-primary/5'
        })}
      >
        <Icons.arrowDown className="w-6 h-6 text-primary/60" />
      </div>
    </div>
  )
}
