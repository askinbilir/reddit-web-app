'use client'

import type { User } from 'next-auth'
import React, { FC } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import UserAvatar from './user-avatar'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface UserAccountNavProps {
  user: Pick<User, 'name' | 'email' | 'image'>
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar className="w-8 h-8 cursor-pointer" user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-primary-foreground" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col gap-y-1 leading-none">
            {user.name ? <p className="font-medium">{user.name}</p> : null}
            {user.email ? (
              <p className="w-[200px] truncate text-sm">{user.email}</p>
            ) : null} 
          </div>
        </div>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/r/create">Create community</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={e => {
            e.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`
            })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
