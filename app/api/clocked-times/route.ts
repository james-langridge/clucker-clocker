import {NextRequest, NextResponse} from 'next/server'

import {auth} from '@/auth'
import {db} from '@/lib/db'

type Body = {
  start: string
  end: string
  userId: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const {start, userId}: Body = await req.json()

    const clockedTime = await db.clockedTime.create({
      data: {
        start: new Date(start),
        userId,
      },
    })

    return NextResponse.json({data: clockedTime}, {status: 201})
  } catch (e) {
    console.error(e)
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const {
      start,
      end,
      id,
      tagId,
      deleted,
    }: {
      start?: Date
      end?: Date
      id: string
      tagId?: string
      deleted?: boolean
    } = await req.json()

    const clockedTime = await db.clockedTime.update({
      where: {
        id,
      },
      data: {
        ...(deleted !== undefined && {deleted}),
        ...(start !== undefined && {start: new Date(start)}),
        ...(end !== undefined && {end: new Date(end)}),
        ...(tagId !== undefined && {tagId}),
      },
    })

    return NextResponse.json({data: clockedTime}, {status: 201})
  } catch (e) {
    console.error(e)
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
  }
}
