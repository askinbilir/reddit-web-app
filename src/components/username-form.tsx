'use client'

import { UsernameRequest, UsernameValidator } from '@/lib/validators/username'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { StatusCodes } from 'http-status-codes'
import { useRouter } from 'next/navigation'

interface UsernameFormProps {
  user: Pick<User, 'id' | 'username'>
}

export default function UsernameForm({ user }: UsernameFormProps) {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: user?.username || ''
    }
  })

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ username }: UsernameRequest) => {
      const payload: UsernameRequest = { username }

      const { data } = await axios.patch('/api/username', payload)

      return data as string
    },
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === StatusCodes.CONFLICT) {
          return toast({
            title: 'Username already taken',
            description: 'Please choose a different user.',
            variant: 'destructive'
          })
        }
      }

      toast({
        title: 'There was an error',
        description: 'Could not change username.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      toast({
        description: 'Your username has been updated.'
      })

      router.refresh()
    }
  })

  return (
    <form onSubmit={handleSubmit(e => updateUsername(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display name you are comfortable with.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-primary/40">u/</span>
            </div>

            <Label className="sr-only" htmlFor="username">
              Name
            </Label>
            <Input
              id="username"
              className="w-[400px] pl-6"
              size={32}
              {...register('username')}
            />
            {errors?.username ? (
              <p className="px-1 text-xs text-destructive">
                {errors.username.message}
              </p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>Change username</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
