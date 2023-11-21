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

  const tags = await db.tag.findMany({
    where: {
      userId: id,
      deleted: false,
    },
  })

  return NextResponse.json(tags)
}
