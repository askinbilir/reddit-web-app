import React from 'react'
import PostFeed from './post-feed'
import { Config } from '@/config'
import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

export default async function CustomFeed() {
  const session = await getAuthSession()

  const followedCommunities = await db.subscription.findMany({
    where: { userId: session?.user.id },
    include: { subreddit: true }
  })

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map(({ subreddit }) => subreddit.id)
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true
    },
    take: Config.INFINITE_SCROLL_PAGINATION_RESULTS
  })

  return <PostFeed initialPosts={posts} />
}
