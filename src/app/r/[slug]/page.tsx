import MiniCreatePost from '@/components/mini-create-post'
import PostFeed from '@/components/post-feed'
import { Config } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = params

  const session = await getAuthSession()

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true
        },
        orderBy: {
          createdAt: 'desc'
        },

        take: Config.INFINITE_SCROLL_PAGINATION_RESULTS
      }
    }
  })

  if (!subreddit) return notFound()

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />

      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  )
}
