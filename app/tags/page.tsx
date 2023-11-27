import * as React from 'react'

import TagsPage from '@/app/tags/tags-page'
import {auth} from '@/auth'
import {db} from '@/lib/db'

const getData = async (id?: string) => {
  if (!id) {
    return {user: undefined}
  }

  const tags = await db.tag.findMany({
    where: {
      userId: id,
      deleted: false,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return {tags}
}

export default async function Page() {
  const session = await auth()
  const {tags} = await getData(session?.user?.id)

  if (!tags) {
    return null
  }

  return (
    <div className="container mx-auto sm:space-y-4">
      <TagsPage tags={tags} />
    </div>
  )
}
