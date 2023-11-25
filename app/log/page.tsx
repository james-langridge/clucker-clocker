import * as React from 'react'

import {auth} from '@/auth'
import {AddTimeForm} from '@/components/add-time-form'
import {db} from '@/lib/db'

import {columns} from './columns'
import {DataTable} from './data-table'

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

export default async function LogPage() {
  const session = await auth()
  const {user} = await getData(session?.user?.id)

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto space-y-4">
      <AddTimeForm tags={user.tags} userId={user.id} />
      <DataTable columns={columns} data={user.clockedTimes} tags={user.tags} />
    </div>
  )
}
