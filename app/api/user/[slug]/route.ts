import {NextRequest, NextResponse} from 'next/server'

import {auth} from '@/auth'
import {db} from '@/lib/db'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
  }

  const id = params.slug

  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      clockedTimes: {
        where: {
          end: null,
          deleted: false,
        },
        include: {
          tag: true,
        },
        orderBy: {
          start: 'desc',
        },
        take: 1,
      },
    },
  })

  return NextResponse.json(user)
}
