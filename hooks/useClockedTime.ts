import {ClockedTime} from '.prisma/client'
import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query'

import {useToast} from '@/components/ui/use-toast'
import {useTag} from '@/hooks/useTag'
import {
  createClockedTime,
  getLastClockedTime,
  updateClockedTime,
} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'
import {clockOutDescription} from '@/lib/utils'

export function useClockedTime({userId}: {userId?: string}) {
  const {tags} = useTag({userId})
  const {toast} = useToast()
  const queryClient = useQueryClient()

  const {data: lastClockedTime} = useQuery({
    queryKey: ['lastClockedTime', userId],
    queryFn: () => getLastClockedTime(userId),
    // refetchInterval: 1000,
  })

  const {mutate: clockInMutate} = useMutation({
    mutationFn: createClockedTime,
    onMutate: async newClockedTime => {
      toast({
        description: 'Clocked in!',
      })
      await queryClient.cancelQueries({queryKey: ['lastClockedTime', userId]})
      const previousLastClockedTime = queryClient.getQueryData([
        'lastClockedTime',
        userId,
      ])
      queryClient.setQueryData(['lastClockedTime', userId], newClockedTime)

      return {previousLastClockedTime}
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['lastClockedTime', userId]})
    },
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

  const {mutate: clockOutMutate} = useMutation({
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

  const {mutate: mutateClockedTime} = useMutation({
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

  return {
    clockInMutate,
    clockOutMutate,
    lastClockedTime,
    mutateClockedTime,
  }
}
