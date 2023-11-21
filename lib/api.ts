import {ClockedTime} from '.prisma/client'
import {Tag, User} from '@prisma/client'

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

export async function updateClockedTime({
  start,
  end,
  id,
  tagId,
  deleted,
}: {
  start?: Date
  end?: Date
  id: string
  tagId?: string
  deleted?: boolean
}) {
  if (typeof id === 'undefined') {
    return Promise.reject(new Error('Invalid id'))
  }

  const body: {
    start?: Date
    end?: Date
    id: string
    tagId?: string
    deleted?: boolean
  } = {id}

  if (start) {
    body.start = start
  }

  if (end) {
    body.end = end
  }

  if (tagId) {
    body.tagId = tagId
  }

  if (deleted) {
    body.deleted = deleted
  }

  const res = await fetch('/api/clocked-times', {
    method: 'PUT',
    body: JSON.stringify(body),
  })

  const {data} = await res.json()

  if (!res.ok) {
    throw new Error(data.error)
  }

  return data
}

export async function createTag({
  name,
  userId,
}: {
  name: string
  userId: string
}) {
  const res = await fetch('/api/tags', {
    method: 'POST',
    body: JSON.stringify({name, userId}),
  })

  const {data} = await res.json()

  if (!res.ok) {
    throw new Error(data.error)
  }

  return data
}

export async function getTags(id?: string): Promise<Tag[]> {
  if (typeof id === 'undefined') {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await fetch(`/api/user/${id}/tags`)

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error)
  }

  return data
}
