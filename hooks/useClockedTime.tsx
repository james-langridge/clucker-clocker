import {ClockedTime} from '.prisma/client'
import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query'
import * as React from 'react'

import {useUserId} from '@/app/user-id-provider'
import {ToastAction} from '@/components/ui/toast'
import {useToast} from '@/components/ui/use-toast'
import {useTag} from '@/hooks/useTag'
import {
  createClockedTime,
  getLastClockedTime,
  updateClockedTime,
} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'
import {clockOutDescription} from '@/lib/utils'

export default function useClockedTime() {
  const {toast} = useToast()
  const {userId} = useUserId()
  const queryClient = useQueryClient()

  const clockIn = useMutation({
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
    onSuccess: data => {
      // data: the created clocked time returned from createClockedTime
      // variables: the vars passed to createClockedTime
      // context: the object returned by onMutate

      toast({
        description: 'Clocked in!',
        action: (
          <ToastAction
            altText="Undo"
            onClick={() => {
              clockOut.mutate({...data, end: new Date(), deleted: true})
            }}
          >
            Undo
          </ToastAction>
        ),
      })
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

  const clockOut = useMutation({
    mutationFn: updateClockedTime,
    onMutate: async updatedClockedTime => {
      const {deleted, end, start: startStr} = updatedClockedTime
      const start = startStr && new Date(startStr)

      if (deleted) {
        // Undo clock in
        toast({
          description: `Cancelled clock in!`,
          variant: 'destructive',
        })
      } else if (start && end) {
        // Clock out
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

  // TODO remove this unused mutation
  // type UpdateClockedTimeParams = {
  //   start?: Date
  //   end: Date | null
  //   id: string
  //   tagId?: string | null
  //   deleted?: boolean
  // }
  //
  // type UndoMutationArgs = UpdateClockedTimeParams & {
  //   lastClockedTime: ClockedTime
  // }
  //
  // const undoClockIn = useMutation({
  //   mutationFn: async (cancelledClockedTime: UndoMutationArgs) => {
  //     const {lastClockedTime, ...clockedTimeToCancel} = cancelledClockedTime
  //     void updateClockedTime(clockedTimeToCancel)
  //
  //     return {lastClockedTime}
  //   },
  //   onMutate: async cancelledClockedTime => {
  //     toast({
  //       description: `Cancelled clock in!`,
  //       variant: 'destructive',
  //     })
  //
  //     await queryClient.cancelQueries({queryKey: ['lastClockedTime', userId]})
  //
  //     // Set the clockedTimeBeforeUndo as the current lastClockedTime
  //     queryClient.setQueryData(
  //       ['lastClockedTime', userId],
  //       cancelledClockedTime.lastClockedTime,
  //     )
  //
  //     // Return a context object with the rolled back undo
  //     return {rolledBackUndo: {...cancelledClockedTime, deleted: false}}
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries({queryKey: ['lastClockedTime', userId]})
  //   },
  //   onError: (err, _, context) => {
  //     toast({
  //       title: 'Error cancelling clock in...',
  //       description: getErrorMessage(err),
  //       variant: 'destructive',
  //     })
  //     queryClient.setQueryData(
  //       ['lastClockedTime', userId],
  //       context?.rolledBackUndo,
  //     )
  //   },
  // })

  return {clockIn, clockOut}
}

export function useLastClockedTime() {
  const {userId} = useUserId()

  const {data: lastClockedTime} = useQuery({
    queryKey: ['lastClockedTime', userId],
    queryFn: () => getLastClockedTime(userId),
    // TODO: delete this comment?
    // refetchInterval: 1000,
  })

  return {lastClockedTime}
}

export function useTagClockedTime() {
  const {userId} = useUserId()
  const {tags} = useTag()
  const {toast} = useToast()
  const queryClient = useQueryClient()

  const {mutate: tagClockedTime} = useMutation({
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

  return {tagClockedTime}
}
