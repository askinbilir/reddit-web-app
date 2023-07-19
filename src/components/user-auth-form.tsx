'use client'

import React, { FC, useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import { Icons } from './icons'
import { useToast } from '@/hooks/use-toast'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const loginWithGoogle = async () => {
    setIsLoading(true)

    try {
      await signIn('google')
    } catch (err) {
      toast({
        title: 'There was a problem',
        description: 'There was an error logging with Google',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        size="sm"
        className="w-full"
        onClick={loginWithGoogle}
        isLoading={isLoading}
      >
        {isLoading ? null : <Icons.google className="w-4 h-4 mr-1" />}
        Google
      </Button>
    </div>
  )
}

export default UserAuthForm
