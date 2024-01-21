import {NextRequest, NextResponse} from 'next/server'

import {auth} from '@/auth'
import {db} from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const id = session.user?.id

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

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const {
      start,
      end,
      tagId,
    }: {
      start: Date
      end?: Date
      tagId?: string
    } = await req.json()

    const clockedTime = await db.clockedTime.create({
      data: {
        start: new Date(start),
        userId: session.user.id,
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
        ...(end === undefined ? {end: null} : {end: new Date(end)}),
        ...(tagId !== undefined && {tagId}),
      },
    })

    return NextResponse.json({data: clockedTime}, {status: 201})
  } catch (e) {
    console.error(e)
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
  }
}
