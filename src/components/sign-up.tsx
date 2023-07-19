import React from 'react'
import { Icons } from './icons'
import Link from 'next/link'
import UserAuthForm from './user-auth-form'

export default function SignUp() {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center gap-y-6 sm:w-[400px]">
      <div className="flex flex-col gap-y-2 text-center">
        <Icons.logo className="mx-auto h-8 w-8" />
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Reddit account and agree to our
          User Agreement and Privacy Policy.
        </p>

        {/* sign in form */}
        <UserAuthForm />

        <p className="px-8 text-center text-sm text-primary">
          Already registered?{' '}
          <Link
            href="/sign-in"
            className="hover:text-primary/80 text-sm underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
