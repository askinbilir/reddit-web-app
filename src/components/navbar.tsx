import Link from 'next/link'
import React from 'react'
import { Icons } from './icons'
import { buttonVariants } from './ui/button'
import { getAuthSession } from '@/lib/auth'
import UserAccountNav from './user-account-nav'
import ThemeToggle from './theme-toggle'
import SearchBar from './search-bar'

export default async function Navbar() {
  const session = await getAuthSession()

  return (
    <nav className="fixed top-0 inset-x-0 h-fit border-b border-primary/10 z-10 py-2 max-w-screen-2xl mx-auto bg-primary-foreground pr-4 xl:pr-0">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo  */}

        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="w-10 h-10 sm:w-8 sm:h-8" />
          <p className="hidden text-primary text-sm font-medium md:block">
            Reddit
          </p>
        </Link>

        {/* search bar */}
        <SearchBar />

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: 'outline' })}
          >
            Sign In
          </Link>
        )}
        <ThemeToggle className='absolute right-1 my-auto'  />
      </div>
    </nav>
  )
}
