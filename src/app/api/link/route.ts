import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const href = url.searchParams.get('url')

  if (!href) {
    return new Response('Invalid href', { status: StatusCodes.BAD_REQUEST })
  }

  const res = await axios.get(href)

  const titleMatch = res.data.match(/<title>(.*?)<\/title>/)
  const title = titleMatch ? titleMatch[1] : ''

  const descriptionMatch = res.data.match(
    /<meta name="description" content="(.*?)"/
  )
  const description = descriptionMatch ? descriptionMatch[1] : ''

  const imageMatch = res.data.match(/<meta property="og:image" content="(.*?)"/)
  const imageUrl = imageMatch ? imageMatch[1] : ''

  return NextResponse.json(
    {
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl
        }
      }
    },
    { status: StatusCodes.OK }
  )
}
