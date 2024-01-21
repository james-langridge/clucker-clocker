import {ClockedTime} from '.prisma/client'
import {Tag} from '@prisma/client'

// Returns the user's most recent clockedTime
export async function getLastClockedTime(): Promise<ClockedTime> {
  const res = await fetch(`/api/clocked-times`)

  const jsonRes = await res.json()

  if (!res.ok) {
    throw new Error(jsonRes.error || 'An error occurred')
  }

  return jsonRes.data
}

export async function createClockedTime({
  start,
  end,
  tagId,
}: {
  start: Date
  end?: Date
  tagId?: string
}) {
  const body: {start: Date; end?: Date; tagId?: string} = {
    start,
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
  start?: string | Date
  end?: Date | null
  id: string
  tagId?: string | null
  deleted?: boolean
}): Promise<ClockedTime> {
  if (typeof id === 'undefined') {
    return Promise.reject(new Error('Invalid id'))
  }

  const body: {
    start?: Date
    end?: Date
    id: string
    tagId?: string | null
    deleted?: boolean
  } = {id}

  if (start) {
    body.start = new Date(start)
  }

  if (end) {
    body.end = end
  }

  if (tagId !== undefined) {
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

export async function createTag({name}: {name: string}): Promise<Tag> {
  const res = await fetch('/api/tags', {
    method: 'POST',
    body: JSON.stringify({name}),
  })

  const jsonRes = await res.json()

  if (!res.ok) {
    throw new Error(jsonRes.error || 'An error occurred')
  }

  return jsonRes.data
}

export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`/api/tags`)

  const jsonRes = await res.json()

  if (!res.ok) {
    throw new Error(jsonRes.error || 'An error occurred')
  }

  return jsonRes.data
}
