import { Icons } from '@/components/icons'
import SignUp from '@/components/sign-up'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={buttonVariants({
            variant: 'ghost',
            className: 'self-start -mt-20'
          })}
        >
          <Icons.left className='w-4 h-4 mr-2' />
          Home
        </Link>

        <SignUp />
      </div>
    </div>
  )
}
