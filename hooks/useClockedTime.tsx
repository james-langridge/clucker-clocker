import {ClockedTime} from '.prisma/client'
import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query'

import {useUserId} from '@/app/user-id-provider'
import {useToast} from '@/components/ui/use-toast'
import {useTag} from '@/hooks/useTag'
import {
  createClockedTime,
  getLastClockedTime,
  updateClockedTime,
} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'
import {clockOutDescription} from '@/lib/utils'

// TODO break down into useCLockIn, useCLockOut etc
export function useClockedTime() {
  const {userId} = useUserId()
  const {tags} = useTag()
  const {toast} = useToast()
  const queryClient = useQueryClient()

  // This is prefetched on the server in app/page.tsx
  const {data: lastClockedTime} = useQuery({
    queryKey: ['lastClockedTime', userId],
    queryFn: () => getLastClockedTime(userId),
    // TODO: delete this comment?
    // refetchInterval: 1000,
  })

  const {data, mutate: clockIn} = useMutation({
    mutationFn: createClockedTime,
    // When mutate is called:
    onMutate: async newClockedTime => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({queryKey: ['lastClockedTime', userId]})

      // Snapshot the previous value
      const previousLastClockedTime = queryClient.getQueryData([
        'lastClockedTime',
        userId,
      ])

      // Optimistically update to the new value
      queryClient.setQueryData(['lastClockedTime', userId], newClockedTime)

      // Return a context object with the snapshotted value
      return {previousLastClockedTime}
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['lastClockedTime', userId]})
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, _, context) => {
      toast({
        title: 'Error clocking in...',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
      queryClient.setQueryData(
        ['lastClockedTime', userId],
        context?.previousLastClockedTime,
      )
    },
  })

  const {mutate: clockOut} = useMutation({
    mutationFn: updateClockedTime,
    onMutate: async updatedClockedTime => {
      const start = lastClockedTime && new Date(lastClockedTime?.start)
      const end = updatedClockedTime.end

      if (start && end) {
        toast({
          title: 'Clocked out!',
          description: clockOutDescription(start, end),
        })
      } else {
        toast({
          description: 'Clocked out!',
        })
      }

      await queryClient.cancelQueries({queryKey: ['lastClockedTime', userId]})
      const previousLastClockedTime = queryClient.getQueryData<ClockedTime>([
        'lastClockedTime',
        userId,
      ])
      queryClient.setQueryData(['lastClockedTime', userId], {
        ...updatedClockedTime,
        tagId: previousLastClockedTime?.tagId,
      })

      return {previousLastClockedTime}
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['lastClockedTime', userId]})
    },
    onError: (err, _, context) => {
      toast({
        title: 'Error clocking out...',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
      queryClient.setQueryData(
        ['lastClockedTime', userId],
        context?.previousLastClockedTime,
      )
    },
  })

  const {mutate: updateClockedTimeMutation} = useMutation({
    mutationFn: updateClockedTime,
    onMutate: async updatedClockedTime => {
      const tag = tags?.find(tag => tag.id === updatedClockedTime.tagId)

      if (tag) {
        toast({
          description: `Tagged with ${tag.name}!`,
        })
      }

      if (updatedClockedTime.tagId === null) {
        toast({
          description: `Removed tag!`,
          variant: 'destructive',
        })
      }

      await queryClient.cancelQueries({queryKey: ['lastClockedTime', userId]})
      const previousLastClockedTime = queryClient.getQueryData([
        'lastClockedTime',
        userId,
      ])
      queryClient.setQueryData(['lastClockedTime', userId], updatedClockedTime)

      return {previousLastClockedTime}
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['lastClockedTime', userId]})
    },
    onError: (err, _, context) => {
      toast({
        title: 'Error tagging...',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
      queryClient.setQueryData(
        ['lastClockedTime', userId],
        context?.previousLastClockedTime,
      )
    },
  })

  type UpdateClockedTimeParams = {
    start?: Date
    end: Date | null
    id: string
    tagId?: string | null
    deleted?: boolean
  }

  // Extend UpdateClockedTimeParams with the additional field
  type UndoMutationArgs = UpdateClockedTimeParams & {
    lastClockedTime: ClockedTime
  }

  const {mutate: undo} = useMutation({
    mutationFn: async (args: UndoMutationArgs) => {
      const {lastClockedTime, ...updateArgs} = args
      updateClockedTime(updateArgs)

      // Return lastClockedTime for use in onMutate and onError
      return {lastClockedTime}
    },
    onMutate: async cancelledClockedTime => {
      toast({
        description: `Cancelled clock in!`,
        variant: 'destructive',
      })

      await queryClient.cancelQueries({queryKey: ['lastClockedTime', userId]})

      // Set the clockedTimeBeforeUndo as the current lastClockedTime
      queryClient.setQueryData(
        ['lastClockedTime', userId],
        cancelledClockedTime.lastClockedTime,
      )

      // Return a context object with the rolled back undo
      return {rolledBackUndo: {...cancelledClockedTime, deleted: false}}
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['lastClockedTime', userId]})
    },
    onError: (err, _, context) => {
      toast({
        title: 'Error cancelling clock in...',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
      queryClient.setQueryData(
        ['lastClockedTime', userId],
        context?.rolledBackUndo,
      )
    },
  })

  return {
    clockIn,
    clockOut,
    data,
    lastClockedTime,
    undo,
    updateClockedTimeMutation,
  }
}
