import {Tag} from '@prisma/client'
import {ClockIcon} from '@radix-ui/react-icons'
import {clsx} from 'clsx'
import * as React from 'react'

import {useClockedTime} from '@/hooks/useClockedTime'

interface TheClockInButtonProps {
  userId: string
  selectedTag: Tag | null
}

export const ClockInButton = React.forwardRef<
  HTMLDivElement,
  TheClockInButtonProps
>(({userId, selectedTag, ...otherProps}, ref) => {
  const {lastClockedTime} = useClockedTime({userId})
  const {clockInMutate, clockOutMutate} = useClockedTime({userId})
  const isClockedIn = lastClockedTime && !lastClockedTime.end

  const onClockInOut = async () => {
    if (!isClockedIn && userId) {
      const body: {start: Date; userId: string; tagId?: string} = {
        start: new Date(),
        userId,
      }

      if (selectedTag) {
        body.tagId = selectedTag.id
      }

      clockInMutate(body)
    }

    if (isClockedIn && lastClockedTime) {
      clockOutMutate({end: new Date(), id: lastClockedTime.id})
    }
  }

  return (
    <div ref={ref} {...otherProps}>
      <button onClick={() => onClockInOut()}>
        <ClockIcon
          className={clsx(
            isClockedIn ? 'animate-pulse text-blue-600' : 'text-green-600',
            'h-72 w-72 ',
          )}
        />
      </button>
    </div>
  )
})

ClockInButton.displayName = 'TheClockInButton'

export default ClockInButton
