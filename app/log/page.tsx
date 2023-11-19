import {auth} from '@/auth'
import {db} from '@/lib/db'

import {columns, User} from './columns'
import {DataTable} from './data-table'

const getData = async (id?: string) => {
  if (!id) {
    return {user: undefined}
  }

  const user: User | null = await db.user.findUnique({
    select: {
      clockedTimes: true,
      clockedTimeGroups: true,
    },
    where: {
      id: id,
    },
  })

  return {user}
}

export default async function DemoPage() {
  const session = await auth()
  const {user} = await getData(session?.user?.id)

  if (!user?.clockedTimes) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={user.clockedTimes} />
    </div>
  )
}
