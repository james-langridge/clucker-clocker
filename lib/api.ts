import {ClockedTime} from '.prisma/client'
import {Tag} from '@prisma/client'

// Returns the user's most recent clockedTime
export async function getLastClockedTime(id?: string): Promise<ClockedTime> {
  if (typeof id === 'undefined') {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await fetch(`/api/user/${id}/last-clocked-time`)

  const jsonRes = await res.json()

  if (!res.ok) {
    throw new Error(jsonRes.error || 'An error occurred')
  }

  return jsonRes.data
}

export async function getClockedTimes(
  id?: string,
): Promise<ClockedTime & {tag: Tag | null}[]> {
  if (typeof id === 'undefined') {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await fetch(`/api/user/${id}/clocked-times`)

  const jsonRes = await res.json()

  if (!res.ok) {
    throw new Error(jsonRes.error || 'An error occurred')
  }

  return jsonRes.data
}

export async function createClockedTime({
  start,
  end,
  userId,
  tagId,
}: {
  start: Date
  end?: Date
  userId: string
  tagId?: string
}) {
  if (typeof userId === 'undefined') {
    return Promise.reject(new Error('Invalid id'))
  }

  const body: {start: Date; end?: Date; userId: string; tagId?: string} = {
    start,
    userId,
  }

  if (end) {
    body.end = end
  }

  if (tagId) {
    body.tagId = tagId
  }

  const res = await fetch('/api/clocked-times', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  const jsonRes = await res.json()

  if (!res.ok) {
    throw new Error(jsonRes.error || 'An error occurred')
  }

  return jsonRes.data
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
}): Promise<ClockedTime> {
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

  const jsonRes = await res.json()

  if (!res.ok) {
    throw new Error(jsonRes.error || 'An error occurred')
  }

  return jsonRes.data
}

export async function createTag({
  name,
  userId,
}: {
  name: string
  userId: string
}): Promise<Tag> {
  const res = await fetch('/api/tags', {
    method: 'POST',
    body: JSON.stringify({name, userId}),
  })

  const jsonRes = await res.json()

  if (!res.ok) {
    throw new Error(jsonRes.error || 'An error occurred')
  }

  return jsonRes.data
}

export async function getTags(id?: string): Promise<Tag[]> {
  if (typeof id === 'undefined') {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await fetch(`/api/user/${id}/tags`)

  const jsonRes = await res.json()

  if (!res.ok) {
    throw new Error(jsonRes.error || 'An error occurred')
  }

  return jsonRes.data
}
