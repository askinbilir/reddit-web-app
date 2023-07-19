import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { UsernameValidator } from '@/lib/validators/username'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: StatusCodes.UNAUTHORIZED })
    }

    const body = await req.json()

    const { username } = UsernameValidator.parse(body)

    const userExist = await db.user.findFirst({
      where: { username }
    })

    if (userExist) {
      return new Response('Username is taken', { status: StatusCodes.CONFLICT })
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { username }
    })

    return new Response('OK', { status: StatusCodes.OK })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request data passed', {
        status: StatusCodes.UNPROCESSABLE_ENTITY
      })
    }

    return new Response('Could not update username, please try again later', {
      status: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}
