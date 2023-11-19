'use client'

import {clsx} from 'clsx'
import {isSameDay, format} from 'date-fns'
import {useIsClient} from 'usehooks-ts'

import {useToast} from '@/components/ui/use-toast'
import {useCount} from '@/hooks/useCount'
import {getErrorMessage} from '@/lib/errors'

export default function ClockInButton({userId}: {userId?: string}) {
  const {toast} = useToast()
  const {hours, isClockedIn, minutes, seconds, start, toggleCounter} =
    useCount()
  const isClient = useIsClient()

  if (!isClient) {
    return null
  }

  const onClick = async () => {
    toggleCounter()

    if (isClockedIn && userId) {
      const end = new Date()

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
          title: 'Time clocked!',
          description,
        })
      }

      const endDate = end.toISOString()
      const body = JSON.stringify({start, end: endDate, userId})

      try {
        await fetch('/api/clocked-times', {
          method: 'POST',
          body,
        })
      } catch (error) {
        toast({
          title: 'Error clocking time...',
          description: getErrorMessage(error),
          variant: 'destructive',
        })
      }
    }
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
