import {ClockedTime} from '.prisma/client'
import {User} from '@prisma/client'

export async function getUser(
  id?: string,
): Promise<User & {clockedTimes: ClockedTime[]}> {
  if (typeof id === 'undefined') {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await fetch(`/api/user/${id}`)

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error)
  }

  return data
}

export async function clockIn({
  start,
  userId,
  tagId,
}: {
  start: Date
  userId: string
  tagId?: string
}) {
  if (typeof userId === 'undefined') {
    return Promise.reject(new Error('Invalid id'))
  }

  const body: {start: Date; userId: string; tagId?: string} = {start, userId}

  if (tagId) {
    body.tagId = tagId
  }

  const res = await fetch('/api/clocked-times', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  const {data} = await res.json()

  if (!res.ok) {
    throw new Error(data.error)
  }

  return data
}

export async function clockOut({end, id}: {end: Date; id: string}) {
  if (typeof id === 'undefined') {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await fetch('/api/clocked-times', {
    method: 'PUT',
    body: JSON.stringify({end, id}),
  })

  const {data} = await res.json()

  if (!res.ok) {
    throw new Error(data.error)
  }

  return data
}
