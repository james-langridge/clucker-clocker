import {NextRequest, NextResponse} from 'next/server'

import {auth} from '@/auth'
import {db} from '@/lib/db'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const id = params.slug

    const clockedTime = await db.clockedTime.findFirst({
      where: {
        userId: id,
        deleted: false,
      },
      include: {
        tag: true,
      },
      orderBy: {
        start: 'desc',
      },
    })

    return NextResponse.json({data: clockedTime}, {status: 200})
  } catch (e) {
    console.error(e)
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
  }
}
