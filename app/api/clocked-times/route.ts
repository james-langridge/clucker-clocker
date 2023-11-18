import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {auth} from '@/auth'
import {differenceInSeconds} from 'date-fns'

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
  const duration = differenceInSeconds(endDate, startDate)

  const clockedTime = await db.clockedTime.create({
    data: {
      start: startDate,
      end: endDate,
      duration,
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
