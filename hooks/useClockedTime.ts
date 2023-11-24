import {useMutation, useQueryClient} from '@tanstack/react-query'
import {format, isSameDay} from 'date-fns'

import {useToast} from '@/components/ui/use-toast'
import {useCount} from '@/hooks/useCount'
import {useTag} from '@/hooks/useTag'
import {clockIn, updateClockedTime} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'

export function useClockedTime({userId}: {userId?: string}) {
  const {start} = useCount(userId)
  const {tags} = useTag({userId})
  const {toast} = useToast()
  const queryClient = useQueryClient()
  const {mutate: clockInMutate} = useMutation({
    mutationFn: clockIn,
    onMutate: () => {
      toast({
        description: 'Clocked in!',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user', userId]})
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
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user', userId]})
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
    onError: error => {
      toast({
        title: 'Error tagging...',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  return {clockInMutate, clockOutMutate, mutateClockedTime}
}
