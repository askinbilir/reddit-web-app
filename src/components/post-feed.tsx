'use client'

import { Config } from '@/config'
import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useEffect, useRef } from 'react'
import Post from './post'
import { Icons } from './icons'

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  subredditName?: string
}

export default function PostFeed({
  initialPosts,
  subredditName
}: PostFeedProps) {
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1
  })

  const { data: session } = useSession()

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${Config.INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '')

      const { data } = await axios.get(query)

      return data as ExtendedPost[]
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [1]
      }
    }
  )

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])

  const posts = data?.pages.flatMap(page => page) ?? initialPosts

  return (
    <ul className="flex flex-col col-span-2 gap-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1

          return acc
        }, 0)

        const currentVote = post.votes.find(
          vote => vote.userId === session?.user.id
        )

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                subredditName={post.subreddit.name}
                post={post}
                commentAmt={post.comments.length}
                currentVote={currentVote}
                votesAmt={votesAmt}
              />
            </li>
          )
        } else {
          return (
            <Post
              key={post.id}
              subredditName={post.subreddit.name}
              post={post}
              commentAmt={post.comments.length}
              currentVote={currentVote}
              votesAmt={votesAmt}
            />
          )
        }
      })}

      {isFetchingNextPage ? (
        <li className="flex justify-center">
          <Icons.loader className="w-6 h-6 text-primary animate-spin" />
        </li>
      ) : null}
    </ul>
  )
}
