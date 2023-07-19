'use client'

import type { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import UserAvatar from './user-avatar'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Icons } from './icons'

interface MiniCreatePostProps {
  session: Session | null
}

export default function MiniCreatePost({ session }: MiniCreatePostProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <section className="overflow-hidden rounded-md bg-secondary/40 shadow py-2">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative h-fit">
          <UserAvatar user={session?.user!} />

          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-accent" />
        </div>

        <Input
          readOnly
          placeholder="Create post"
          onClick={() => router.push(pathname + '/submit')}
        />

        <Button
          variant="ghost"
          onClick={() => router.push(pathname + '/submit')}
        >
          <Icons.image className="text-primary/70" />
        </Button>

        <Button
          variant="ghost"
          onClick={() => router.push(pathname + '/submit')}
        >
          <Icons.link className="text-primary/70" />
        </Button>
      </div>
    </section>
  )
}
