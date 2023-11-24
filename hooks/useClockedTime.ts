import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query'
import {format, isSameDay} from 'date-fns'

import {useToast} from '@/components/ui/use-toast'
import {useTag} from '@/hooks/useTag'
import {clockIn, getLastClockedTime, updateClockedTime} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'

export function useClockedTime({
  userId,
  start,
}: {
  userId?: string
  start?: Date
}) {
  const {tags} = useTag({userId})
  const {toast} = useToast()
  const queryClient = useQueryClient()

  const {data: lastClockedTime} = useQuery({
    queryKey: ['lastClockedTime', userId],
    queryFn: () => getLastClockedTime(userId),
    refetchInterval: 1000,
  })

  const {mutate: clockInMutate} = useMutation({
    mutationFn: clockIn,
    onMutate: () => {
      toast({
        description: 'Clocked in!',
      })
    },
    onSuccess: newClockedTime => {
      queryClient.setQueryData(['lastClockedTime', userId], newClockedTime)
    },
    onError: error => {
      toast({
        title: 'Error clocking in...',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  const {mutate: clockOutMutate} = useMutation({
    mutationFn: updateClockedTime,
    onMutate: variables => {
      const end = variables.end

      if (start && end) {
        const isDaySame = isSameDay(start, end)
        const startTime = format(start, 'h:mm a')
        const endTime = format(end, 'h:mm a')
        const startDay = format(start, 'MMM d, yyyy')
        const endDay = format(end, 'MMM d, yyyy')

        const description = isDaySame
          ? `${startDay} from ${startTime} to ${endTime}`
          : `${startDay} at ${startTime} to ${endDay} at ${endTime}`

        toast({
          title: 'Clocked out!',
          description,
        })
      } else {
        toast({
          description: 'Clocked out!',
        })
      }
    },
    onSuccess: newClockedTime => {
      queryClient.setQueryData(['lastClockedTime', userId], newClockedTime)
    },
    onError: error => {
      toast({
        title: 'Error clocking out...',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  const {mutate: mutateClockedTime} = useMutation({
    mutationFn: updateClockedTime,
    onMutate: variables => {
      const tag = tags?.find(tag => tag.id === variables.tagId)

      if (tag) {
        toast({
          description: `Tagged with ${tag.name}!`,
        })
      }
    },
    onSuccess: newClockedTime => {
      queryClient.setQueryData(['lastClockedTime', userId], newClockedTime)
    },
    onError: error => {
      toast({
        title: 'Error tagging...',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  const {mutate: deleteClockedTime} = useMutation({
    mutationFn: updateClockedTime,
    onMutate: () =>
      toast({
        description: `Time deleted!`,
      }),
    onSuccess: deletedTime => {
      if (deletedTime.id === lastClockedTime?.id) {
        queryClient.invalidateQueries({queryKey: ['lastClockedTime', userId]})
      }
    },
    onError: error => {
      toast({
        title: 'Error deleting time...',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  return {
    clockInMutate,
    clockOutMutate,
    deleteClockedTime,
    lastClockedTime,
    mutateClockedTime,
  }
}
