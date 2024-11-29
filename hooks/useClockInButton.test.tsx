import {renderHook, act, waitFor} from '@testing-library/react'
import {http, HttpResponse} from 'msw'
import {describe, it, expect, beforeEach, vi} from 'vitest'

import {useSelectedTag} from '@/app/selected-tag-provider'
import {createWrapper} from '@/lib/test-utils'
import {server} from '@/mocks/node'

import {useClockInButton} from './useClockInButton'

vi.mock('@/app/selected-tag-provider')

describe('useClockInButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSelectedTag).mockReturnValue({
      selectedTag: null,
      setSelectedTag: vi.fn(),
    })
  })

  it('should return isClockedIn as false when there is no last clocked time', async () => {
    server.use(
      http.get('/api/clocked-times', () => {
        return HttpResponse.json({data: null})
      }),
    )

    const {result} = renderHook(() => useClockInButton(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isClockedIn).toBe(false)
    })
  })

  it('should return isClockedIn as true when there is an ongoing clock-in', async () => {
    server.use(
      http.get('/api/clocked-times', () => {
        return HttpResponse.json({
          data: {id: '1', start: new Date(), end: null},
        })
      }),
    )

    const {result} = renderHook(() => useClockInButton(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isClockedIn).toBe(true)
    })
  })

  it('should clock in without tag when no tag is selected', async () => {
    interface ClockedTimeRequest {
      start: string
      tagId?: string
    }

    server.use(
      http.get('/api/clocked-times', () => {
        return HttpResponse.json({data: null})
      }),
    )

    let capturedBody: ClockedTimeRequest | null = null
    server.use(
      http.post('/api/clocked-times', async ({request}) => {
        capturedBody = (await request.json()) as ClockedTimeRequest
        return HttpResponse.json({
          data: {
            /* mock clocked time response */
          },
        })
      }),
    )

    const {result} = renderHook(() => useClockInButton(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isClockedIn).toBe(false)
    })

    await act(async () => {
      await result.current.toggleClockIn()
    })

    expect(capturedBody).toEqual({
      start: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
    })
  })

  it('should clock in with tag when a tag is selected', async () => {
    const mockTag = {
      id: 'tag-1',
      name: 'Test Tag',
      userId: 'user-1',
      deleted: false,
    }
    vi.mocked(useSelectedTag).mockReturnValue({
      selectedTag: mockTag,
      setSelectedTag: vi.fn(),
    })

    interface ClockedTimeRequest {
      start: Date
      tagId?: string
    }

    server.use(
      http.get('/api/clocked-times', () => {
        return HttpResponse.json({data: null})
      }),
    )

    let capturedBody: ClockedTimeRequest | null = null
    server.use(
      http.post('/api/clocked-times', async ({request}) => {
        capturedBody = (await request.json()) as ClockedTimeRequest
        return HttpResponse.json({
          data: {
            /* mock clocked time response */
          },
        })
      }),
    )

    const {result} = renderHook(() => useClockInButton(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isClockedIn).toBe(false)
    })

    await act(async () => {
      await result.current.toggleClockIn()
    })

    expect(capturedBody).toEqual({
      start: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
      tagId: 'tag-1',
    })
  })

  it('should clock out when currently clocked in', async () => {
    const mockLastClockedTime = {
      id: 'time-1',
      start: new Date('2024-01-01T10:00:00'),
      end: null,
    }

    server.use(
      http.get('/api/clocked-times', () => {
        return HttpResponse.json({data: mockLastClockedTime})
      }),
    )

    interface ClockedTimeRequest {
      start: string
      end: string
      id: string
    }

    let capturedBody: ClockedTimeRequest | null = null
    server.use(
      http.put('/api/clocked-times', async ({request}) => {
        capturedBody = (await request.json()) as ClockedTimeRequest
        return HttpResponse.json({
          data: {
            /* mock clocked time response */
          },
        })
      }),
    )

    const {result} = renderHook(() => useClockInButton(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isClockedIn).toBe(true)
    })

    await act(async () => {
      await result.current.toggleClockIn()
    })

    expect(capturedBody).toEqual({
      ...mockLastClockedTime,
      start: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
      end: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
    })
  })
})
