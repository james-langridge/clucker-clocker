import * as React from 'react'

import LogPage from '@/app/log/log-page'
import {auth} from '@/auth'
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
          end: {
            not: null,
          },
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

export default async function Page() {
  const session = await auth()
  const {user} = await getData(session?.user?.id)

  return <LogPage user={user} />
}
