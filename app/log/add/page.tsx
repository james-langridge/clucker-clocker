import * as React from 'react'

import {auth} from '@/auth'
import ClockedTimeForm from '@/components/clocked-time-form'
import {db} from '@/lib/db'

const getData = async (id?: string) => {
  if (!id) {
    return {user: undefined}
  }

  const user = await db.user.findUnique({
    select: {
      id: true,
      clockedTimes: {
        where: {
          deleted: false,
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
      id: id,
    },
  })

  return {user}
}

export default async function AddClockedTime() {
  const session = await auth()
  const {user} = await getData(session?.user?.id)

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="prose text-3xl p-6">Clock a time</h1>
      <ClockedTimeForm tags={user.tags} userId={user.id} />
    </div>
  )
}
