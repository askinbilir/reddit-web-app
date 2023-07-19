import { Icons } from '@/components/icons'
import CustomFeed from '@/components/custom-feed'
import GeneralFeed from '@/components/general-feed'
import { buttonVariants } from '@/components/ui/button'
import { getAuthSession } from '@/lib/auth'
import Link from 'next/link'
import React from 'react'

export default async function Home() {
  const session = await getAuthSession()

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {session ? <CustomFeed /> : <GeneralFeed />}

        {/* subreddit info */}
        <div className="overflow-hidden h-fit rounded-lg border border-primary/20 order-first md:order-last">
          <div className="bg-emerald-200 dark:bg-emerald-600 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <Icons.home className="w-4 h-4" />
              Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-primary px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-primary/60">
                Your personal Reddit homepage. Come here to check in with your
                favorite communities
              </p>
            </div>

            <Link
              href="/r/create"
              className={buttonVariants({ className: 'w-full mt-4 mb-6' })}
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
