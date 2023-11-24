import {NextRequest, NextResponse} from 'next/server'

import {auth} from '@/auth'
import {db} from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const {name, userId} = await req.json()

    const tag = await db.tag.create({
      data: {
        name,
        userId,
      },
    })

    return NextResponse.json({data: tag}, {status: 201})
  } catch (e) {
    console.error(e)
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
  }
}
