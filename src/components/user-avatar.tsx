import React, { FC } from 'react'
import type { User } from 'next-auth'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import type { AvatarProps } from '@radix-ui/react-avatar'
import { Icons } from './icons'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'name' | 'image'>
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user?.image ? (
        <AvatarImage
          src={user.image}
          className="relative aspect-square w-full h-full"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="w-4 h-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar
