'use client'

import React, { startTransition } from 'react'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import type { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import axios, { AxiosError } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SubscribeLeaveToggleProps {
  subredditId: string
  subredditName: string
  isSubscribed: boolean
}

export default function SubscribeLeaveToggle({
  subredditId,
  subredditName,
  isSubscribed
}: SubscribeLeaveToggleProps) {
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId
      }

      const { data } = await axios.post('/api/subreddit/subscribe', payload)

      return data as string
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
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Subscribed',
        description: `You are now subscribed to r/${subredditName}`
      })
    }
  })

  const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId
      }

      const { data } = await axios.post('/api/subreddit/unsubscribe', payload)

      return data as string
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
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Unsubscribed',
        description: `You are now unsubscribed from r/${subredditName}`
      })
    }
  })

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isUnSubLoading}
      onClick={() => unsubscribe()}
    >
      Leave Community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  )
}
