'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { CreateSubredditPayload } from '@/lib/validators/subreddit'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Page() {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input
      }

      const { data } = await axios.post('/api/subreddit', payload)

      return data as string
    },
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === StatusCodes.CONFLICT) {
          return toast({
            title: 'Subreddit already exist',
            description: 'Please choose a different subreddit name.',
            variant: 'destructive'
          })
        }
        if (err.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
          return toast({
            title: 'Invalid subreddit name',
            description: 'Please choose a name between 3 and 21 characters.',
            variant: 'destructive'
          })
        }

        if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          return loginToast()
        }
      }

      toast({
        title: 'There was an error',
        description: 'Could not create subreddit.',
        variant: 'destructive'
      })
    },
    onSuccess: data => {
      router.push(`/r/${data}`)
    }
  })

  return (
    <div className="container flex items-center max-w-3xl h-full mx-auto">
      <div className="relative bg-secondary w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>

        <hr className="bg-primary/10 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community name including capitalization cannot be changed.
          </p>

          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-primary/60">
              r/
            </p>
            <Input
              className="pl-6 bg-background/50"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            disabled={input.length === 0}
            isLoading={isLoading}
            onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  )
}
