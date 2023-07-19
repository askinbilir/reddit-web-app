import { Config } from '@/config'
import { db } from '@/lib/db'
import React from 'react'
import PostFeed from './post-feed'

export default async function GeneralFeed() {
  const posts = await db.post.findMany({
    orderBy: {createdAt: 'desc'},
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true
    },
    take: Config.INFINITE_SCROLL_PAGINATION_RESULTS
  })

  return (
    <PostFeed initialPosts={posts} />
  )
}
