import { VoteType } from "@prisma/client"

export type CachedPost = {
  id: string
  title: string
  authorUsername: string
  content: string
  createdAt: Date
}