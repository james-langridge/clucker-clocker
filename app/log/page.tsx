import {auth} from '@/auth'
import {db} from '@/lib/db'

import {columns} from './columns'
import {DataTable} from './data-table'

const getData = async (id?: string) => {
  if (!id) {
    return {user: undefined}
  }

  const user = await db.user.findUnique({
    select: {
      clockedTimes: {
        where: {
          deleted: false,
        },
        include: {
          tags: true,
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

  if (!user?.clockedTimes) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={user.clockedTimes} tags={user.tags} />
    </div>
  )
}
