'use client'

import { useCustomToast } from '@/hooks/use-custom-toast'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { CommentVoteRequest } from '@/lib/validators/vote'
import axios, { AxiosError } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { toast } from '@/hooks/use-toast'
import { Button } from './ui/button'
import { Icons } from './icons'

interface CommentVoteProps {
  commentId: string
  initialVotesAmt: number
  initialVote?: Pick<CommentVote, 'type'>
}

export default function CommentVote({
  commentId,
  initialVotesAmt,
  initialVote
}: CommentVoteProps) {
  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType
      }

      await axios.patch('/api/subreddit/post/comment/vote', payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt(prev => prev - 1)
      if (voteType === 'DOWN') setVotesAmt(prev => prev + 1)

      // reset current vote
      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered, please try again later',
        variant: 'destructive'
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt(prev => prev - 1)
        if (type === 'DOWN') setVotesAmt(prev => prev + 1)
      } else {
        setCurrentVote({ type })
        if (type === 'UP') setVotesAmt(prev => prev + (currentVote ? 2 : 1))
        if (type === 'DOWN') setVotesAmt(prev => prev - (currentVote ? 2 : 1))
      }
    }
  })

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="hover:bg-primary/5"
        aria-label="upvote"
        onClick={() => vote('UP')}
      >
        <Icons.arrowUp
          className={cn('w-6 h-6 text-primary/60', {
            'text-emerald-400 dark:text-emerald-600 dark:fill-emerald-600 fill-emerald-400 ':
              currentVote?.type === 'UP'
          })}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-primary">
        {votesAmt}
      </p>

      <Button
        size="sm"
        variant="ghost"
        className="hover:bg-primary/5"
        aria-label="downvote"
        onClick={() => vote('DOWN')}
      >
        <Icons.arrowDown
          className={cn('w-6 h-6 text-primary/60', {
            'text-rose-400 dark:text-rose-600 dark:fill-rose-600 fill-rose-400 ':
              currentVote?.type === 'DOWN'
          })}
        />
      </Button>
    </div>
  )
}
