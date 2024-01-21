import React from 'react'

import {auth} from '@/auth'
import ClockedTimeForm from '@/components/clocked-time-form'
import {db} from '@/lib/db'

const getData = async (id: string, userId?: string) => {
  if (!userId) {
    return {user: undefined}
  }

  const user = await db.user.findUnique({
    select: {
      id: true,
      clockedTimes: {
        where: {
          id: id,
        },
        include: {
          tag: true,
        },
      },
      tags: {
        where: {
          deleted: false,
        },
      },
    },
    where: {
      id: userId,
    },
  })

  return {user}
}

export default async function EditTimePage({params}: {params: {id: string}}) {
  const session = await auth()
  const {id} = params
  const {user} = await getData(id, session?.user?.id)
  const time = user?.clockedTimes[0]

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="prose text-3xl p-6">Edit clocked time</h1>
      <ClockedTimeForm tags={user.tags} time={time} />
    </div>
  )
}
