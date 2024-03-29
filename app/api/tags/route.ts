import {NextRequest, NextResponse} from 'next/server'

import {auth} from '@/auth'
import {db} from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const id = session.user.id

    const tags = await db.tag.findMany({
      where: {
        userId: id,
        deleted: false,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({data: tags}, {status: 200})
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

    const {name} = await req.json()

    const tag = await db.tag.create({
      data: {
        name,
        userId: session.user.id,
      },
    })

    return NextResponse.json({data: tag}, {status: 201})
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
      id,
      deleted,
    }: {
      id: string
      deleted: boolean
    } = await req.json()

    if (deleted) {
      const tag = await db.$transaction(async db => {
        await db.clockedTime.updateMany({
          where: {tagId: id},
          data: {tagId: null},
        })

        return db.tag.update({
          where: {id},
          data: {
            deleted,
          },
        })
      })

      return NextResponse.json({data: tag}, {status: 201})
    }

    const tag = await db.tag.update({
      where: {id},
      data: {
        deleted,
      },
    })

    return NextResponse.json({data: tag}, {status: 201})
  } catch (e) {
    console.error(e)
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
  }
}
