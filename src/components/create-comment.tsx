'use client'

import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import { CommentRequest } from '@/lib/validators/comment'
import axios, { AxiosError } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { toast } from '@/hooks/use-toast'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { useRouter } from 'next/navigation'

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

export default function CreateComment({
  postId,
  replyToId
}: CreateCommentProps) {
  const [input, setInput] = useState<string>('')
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId
      }

      const { data } = await axios.patch('/api/subreddit/post/comment', payload)

      return data
    },
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          return loginToast()
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Something is wrong, please try again.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      setInput('')
      router.refresh()
    }
  })

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
          className='bg-primary/5'
        />

        <div className="mt-2 flex justify-end">
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => comment({ postId, text: input, replyToId })}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}
