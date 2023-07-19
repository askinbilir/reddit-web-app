'use client'

import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import React, { useRef } from 'react'
import { Icons } from './icons'
import EditorOutput from './editor-output'
import PostVoteClient from './post-vote/post-vote-client'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  subredditName: string
  post: Post & {
    author: User
    votes: Vote[]
  }
  commentAmt: number
  votesAmt: number
  currentVote?: PartialVote
}

export default function Post({
  subredditName,
  post,
  commentAmt,
  votesAmt,
  currentVote
}: PostProps) {
  const postRef = useRef<HTMLDivElement>(null)

  return (
    <div className="rounded-md bg-secondary shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmt={votesAmt}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 flex items-baseline text-xs text-primary/70">
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className="underline text-primary text-sm underline-offset-2"
                >
                  r/{subredditName}
                </a>
                <Icons.dot className="self-end pb-1" />
              </>
            ) : null}
            <span className="mr-1 -ml-1.5">Posted by u/{post.author.username}</span>
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-primary">
              {post.title}
            </h1>
          </a>
          <div
            ref={postRef}
            className="relative text-sm max-h-40 w-full overflow-clip"
          >
            <EditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-secondary to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-primary/5 z-20 text-sm p-2 sm:px-6">
        <a
          href={`/r/${subredditName}/post/${post.id}`}
          className="w-fit flex items-center gap-2 hover:bg-primary/10 p-2 rounded-md"
        >
          <Icons.commentReply className="w-4 h-4" />
          {commentAmt} comments
        </a>
      </div>
    </div>
  )
}
