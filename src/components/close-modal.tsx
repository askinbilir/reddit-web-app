'use client'

import React from 'react'
import { Button } from './ui/button'
import { Icons } from './icons'
import { useRouter } from 'next/navigation'

export default function CloseModal() {
  const router = useRouter()

  return (
    <Button
      variant="subtle"
      className="h-6 w-8 p-0 rounded-md"
      aria-label="close modal"
      onClick={() => router.back()}
    >
      <Icons.close className="w-4 h-4" />
    </Button>
  )
}
