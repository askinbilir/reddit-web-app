'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Prisma, Subreddit } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Icons } from './icons'
import debounce from 'lodash.debounce'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { usePathname } from 'next/navigation'

export default function SearchBar() {
  const [input, setInput] = useState<string>('')

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)

      return data as (Subreddit & { _count: Prisma.SubredditCountOutputType })[]
    },
    queryKey: ['search-query'],
    enabled: false
  })

  const request = debounce(() => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()
  }, [])

  const router = useRouter()
  const commandRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  useEffect(() => {
    setInput('')
  }, [pathname])

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
        value={input}
        onValueChange={value => {
          setInput(value)
          debounceRequest()
        }}
      />

      {input.length > 0 ? (
        <CommandList className="absolute bg-secondary top-full inset-x-0 shadow rounded-b-md">
          {isFetched ? <CommandEmpty>No results.</CommandEmpty> : null}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map(subreddit => (
                <CommandItem
                  key={subreddit.id}
                  value={subreddit.name}
                  className="aria-selected:bg-primary/5"
                  onSelect={e => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }}
                >
                  <Icons.users className="mr-2 w-4 h-4" />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  )
}
