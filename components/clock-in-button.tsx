'use client'

import {useMutation, useQueryClient} from '@tanstack/react-query'
import {clsx} from 'clsx'
import {format, isSameDay} from 'date-fns'
import {useIsClient} from 'usehooks-ts'

import SignInDialog from '@/components/sign-in-dialog'
import {useToast} from '@/components/ui/use-toast'
import {useCount} from '@/hooks/useCount'
import {clockIn, clockOut} from '@/lib/api'
import {getErrorMessage} from '@/lib/errors'

export default function ClockInButton({userId}: {userId?: string}) {
  const {toast} = useToast()
  const {activeId, hours, isClockedIn, minutes, seconds, start, toggleCounter} =
    useCount(userId)
  const isClient = useIsClient()
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
    mutationFn: clockOut,
    onMutate: variables => {
      const end = variables.end

      if (start) {
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

  if (!isClient) {
    return null
  }

  const onClick = async () => {
    toggleCounter()

    if (!isClockedIn && userId) {
      clockInMutate({start: new Date(), userId})
    }

    if (isClockedIn && activeId) {
      clockOutMutate({end: new Date(), id: activeId})
    }
  }

  if (!userId) {
    return (
      <div className="flex flex-col justify-between items-center h-full w-full">
        <div className="grow flex flex-col justify-center items-center h-full w-full">
          <SignInDialog />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-between items-center h-full w-full">
      <div className="grow flex flex-col justify-center items-center h-full w-full">
        <button
          onClick={() => onClick()}
          className={clsx(
            isClockedIn ? 'bg-fuchsia-600' : 'bg-emerald-700',
            'rounded-full w-full max-w-xs h-80',
          )}
        >
          {hours}h {minutes}m {seconds}s
        </button>
      </div>
    </div>
  )
}
