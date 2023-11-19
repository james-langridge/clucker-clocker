import {NextRequest, NextResponse} from 'next/server'

import {auth} from '@/auth'
import {db} from '@/lib/db'

type Body = {
  start: string
  end: string
  userId: string
}

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
  }

  const {start, end, userId}: Body = await req.json()

  const startDate = new Date(start)
  const endDate = new Date(end)

  const clockedTime = await db.clockedTime.create({
    data: {
      start: startDate,
      end: endDate,
      userId,
    },
  })

  return NextResponse.json(
    {clockedTime},
    {
      status: 201,
    },
  )
}

export async function PUT(req: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
  }

  const {
    id,
    deleted,
    start,
    end,
  }: {
    id: string
    deleted?: boolean
    start?: string
    end?: string
  } = await req.json()

  const clockedTime = await db.clockedTime.update({
    where: {
      id,
    },
    data: {
      ...(deleted !== undefined && {deleted}),
      ...(start !== undefined && {start: new Date(start)}),
      ...(end !== undefined && {end: new Date(end)}),
    },
  })

  return NextResponse.json(
    {clockedTime},
    {
      status: 201,
    },
  )
}
