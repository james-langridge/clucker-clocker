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
    onSuccess: (data, variables) => {
      // data: the updated clocked time returned from updateClockedTime
      // variables: the vars passed to updateClockedTime
      // context: the object returned by onMutate
      const {deleted, end, start: startStr} = variables
      const start = startStr && new Date(startStr)
      const action = (
        <ToastAction
          altText="Undo"
          onClick={() => {
            undoClockOut.mutate({...data, end: undefined})
          }}
        >
          Undo
        </ToastAction>
      )

      if (deleted) {
        toast({
          description: `Cancelled clock in!`,
          variant: 'destructive',
        })
      } else if (start && end) {
        toast({
          title: 'Clocked out!',
          description: clockOutDescription(start, end),
          action,
        })
      } else {
        toast({
          description: 'Clocked out!',
          action,
        })
      }
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

  const undoClockOut = useMutation({
    mutationFn: updateClockedTime,
    // When mutate is called:
    onMutate: async updatedClockedTime => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({queryKey: ['lastClockedTime', userId]})

      // Snapshot the previous value
      const previousLastClockedTime = queryClient.getQueryData([
        'lastClockedTime',
        userId,
      ])

      // Optimistically update to the new value
      queryClient.setQueryData(['lastClockedTime', userId], updatedClockedTime)

      // Return a context object with the snapshotted value
      return {previousLastClockedTime}
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['lastClockedTime', userId]})
    },
    onSuccess: () => {
      // data: the created clocked time returned from createClockedTime
      // variables: the vars passed to createClockedTime
      // context: the object returned by onMutate
      toast({
        description: 'Clocked back in!',
      })
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, _, context) => {
      toast({
        title: 'Error clocking back in...',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
      queryClient.setQueryData(
        ['lastClockedTime', userId],
        context?.previousLastClockedTime,
      )
    },
  })

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
